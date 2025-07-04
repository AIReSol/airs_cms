import 'dotenv/config';
import { createClient } from '@sanity/client';
import { schemaTypes } from '../schemaTypes';

const client = createClient({
  projectId: 'v7ufktq0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Extract valid types from schema definitions and add system types
const validTypes = [
  ...schemaTypes.map(schema => schema.name),
  // system data types, CANNOT delete
  'system.group',
  'system.retention',
  'system.user',
  'system.role',
  'system.permission',
  'system.token',
  'sanity.imageAsset',
]

interface GeneralDocument {
  _id: string;
  _type: string;
}

async function cleanupOrphanedDocuments() {
  try {
    // Find documents with invalid types
    // Add this filter to exclude system documents
    const invalidDocs = await client.fetch(
      `*[!(_type in $validTypes)] { _id, _type }`,
      { validTypes }
    )
    
    console.log(`Found ${invalidDocs.length} documents with invalid types:`)
    invalidDocs.forEach((doc: GeneralDocument) => {
      console.log(`- ${doc._id} (type: ${doc._type})`)
    })
    
    if (invalidDocs.length === 0) {
      console.log('No invalid documents found!')
      return
    }
    
    // Confirm before deletion
    console.log('\nWARNING: This will permanently delete these documents!')
    console.log('Type "y" to confirm deletion, or any other key to cancel:')
    
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const confirmation = await new Promise<string>((resolve) => {
      rl.question('', (answer: string) => {
        rl.close()
        resolve(answer.trim().toLowerCase())
      })
    })
    
    if (confirmation !== 'y') {
      console.log('Deletion cancelled.')
      return
    }
    
    // Delete invalid documents one by one to handle reference errors
    let deletedCount = 0
    let skippedCount = 0
    const skippedDocs: Array<{ id: string; reason: string; referencedBy?: string[] }> = []

    console.log('\nStarting deletion process...')
    
    for (let i = 0; i < invalidDocs.length; i++) {
      const doc = invalidDocs[i]
      console.log(`Processing ${i + 1}/${invalidDocs.length}: ${doc._id}`)
      
      try {
        await client.delete(doc._id)
        console.log(`✅ Deleted: ${doc._id}`)
        deletedCount++
      } catch (error: any) {
        if (error.message && error.message.includes('references to it')) {
          // Extract referencing IDs from error details
          const referencingIds = error.details?.items?.[0]?.error?.referencingIDs || []
          console.log(`⚠️  Cannot delete ${doc._id} - Referenced by ${referencingIds.length} documents`)
          
          // Find what types of documents are referencing this
          try {
            const references = await client.fetch(
              `*[_id in $refIds] { _id, _type, title, name }`,
              { refIds: referencingIds.slice(0, 5) } // Limit to first 5 for performance
            )
            console.log(`   Referenced by: ${references.map((ref: any) => `${ref._type}(${ref._id.slice(0, 8)}...)`).join(', ')}`)
            
            skippedDocs.push({
              id: doc._id,
              reason: 'Has references',
              referencedBy: referencingIds
            })
          } catch (refError) {
            console.log(`   Could not fetch reference details`)
            skippedDocs.push({
              id: doc._id,
              reason: 'Has references (details unavailable)'
            })
          }
        } else {
          console.log(`❌ Error deleting ${doc._id}: ${error.message}`)
          skippedDocs.push({
            id: doc._id,
            reason: error.message
          })
        }
        skippedCount++
      }
    }

    // Summary
    console.log('\n=== Cleanup Summary ===')
    console.log(`✅ Successfully deleted: ${deletedCount} documents`)
    console.log(`⚠️  Skipped: ${skippedCount} documents`)
    
    if (skippedDocs.length > 0) {
      console.log('\nSkipped documents:')
      skippedDocs.forEach(doc => {
        console.log(`- ${doc.id}: ${doc.reason}`)
      })
      
      console.log('\n💡 Tip: Documents with references cannot be deleted until the references are removed.')
      console.log('   Consider updating the referencing documents first, or check if these are actually valid documents.')
    }
    
  } catch (error) {
    console.error('Error cleaning up documents:', error)
  }
}

cleanupOrphanedDocuments()