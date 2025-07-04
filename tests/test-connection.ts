import 'dotenv/config';
import { createClient } from '@sanity/client';

// Initialize Sanity client
const client = createClient({
  projectId: 'v7ufktq0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})

// Add this after the client initialization
console.log('Token configured:', !!process.env.SANITY_API_TOKEN)
console.log('Token length:', process.env.SANITY_API_TOKEN?.length || 0)

async function testConnection(): Promise<void> {
  try {
    console.log('Testing Sanity connection...')
    
    // Test basic connection
    const result = await client.fetch('*[_type == "skillIcon"] | order(_createdAt desc) [0...5] { _id, name }')
    // const result = await client.fetch('*[_type == "person"] | order(_createdAt desc) [0...5] { _id, firstName }')
    console.log('✅ Connection successful!')
    console.log('Existing skillIcon documents:', result.length)
    
    if (result.length > 0) {
      console.log('Sample documents:', result)
    }
    
    // Test create permission with a simple test document
    console.log('\nTesting create permissions...')
    const testDoc = {
      _type: 'skillIcon',
      name: 'test-connection',
      icon: '<svg><title>Test</title></svg>'
    }
    
    try {
      const created = await client.create(testDoc)
      console.log('✅ Create permission test successful!')
      
      // Clean up test document
      await client.delete(created._id)
      console.log('✅ Test document cleaned up')
    } catch (createError) {
      console.error('❌ Create permission test failed:', createError instanceof Error ? createError.message : createError)
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error instanceof Error ? error.message : error)
  }
}

// Run the test
testConnection().catch(console.error)