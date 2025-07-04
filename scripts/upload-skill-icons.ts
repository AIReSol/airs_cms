import 'dotenv/config';
import { createClient } from '@sanity/client'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Initialize Sanity client
const client = createClient({
  projectId: 'v7ufktq0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN // You'll need to set this environment variable
})

interface SkillIconDocument {
  _id: string;
  _type: 'skillIcon';
  name: string;
  icon: string;
}

async function uploadSkillIcons(): Promise<void> {
  const skillIconsDir = join(__dirname, '..', 'data', 'skill-icons')
  
  try {
    const svgFiles = readdirSync(skillIconsDir).filter(file => file.endsWith('.svg'))
    console.log(`Found ${svgFiles.length} SVG files to upload`)
    
    for (const svgFile of svgFiles) {
      const svgPath = join(skillIconsDir, svgFile)
      const svgContent = readFileSync(svgPath, 'utf-8')
      
      // Extract title from SVG content
      const titleMatch = svgContent.match(/<title[^>]*>([^<]+)<\/title>/i)
      const skillName = titleMatch ? titleMatch[1].trim() : svgFile.replace('.svg', '')
      
      // Create document ID
      const docId = `skillIcon-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      
      // Check if document already exists
      const existingDoc = await client.fetch('*[_type == "skillIcon" && _id == $id][0]', { id: docId })
      
      if (existingDoc) {
        console.log(`Skipping ${skillName} - already exists`)
        continue
      }
      
      // Create the skillIcon document
      const doc: SkillIconDocument = {
        _id: docId,
        _type: 'skillIcon',
        name: skillName,
        icon: svgContent.trim()
      }
      
      try {
        await client.create(doc)
        console.log(`✅ Created skillIcon: ${skillName}`)
      } catch (error) {
        console.error(`❌ Failed to create ${skillName}:`, error instanceof Error ? error.message : error)
      }
    }
    
    console.log('\n🎉 Skill icons upload completed!')
  } catch (error) {
    console.error('Error uploading skill icons:', error)
  }
}

// Run the upload
uploadSkillIcons().catch(console.error)