import { client } from '../lib/client';

// GROQ query to fetch person data
const query = `
  *[_type=="person" && slug.current == "zefang-shen"]{ 
    _id, 
    slug, 
    firstName, 
    lastName, 
    photo, 
    jobTitle, 
    tagline, 
    bio, 
    careerSummary[]{ 
      name,
      count,
      description,
    }, 
    skills[]{ 
      skillIcon->, 
      description, 
      isFeatured 
    }, 
    publishedAt 
  }
`;

async function queryPerson(outputFile: string) {
  try {
    console.log('Executing query...');
    const result = await client.fetch(query);
    
    if (result.length === 0) {
      console.log('No person found with slug "zefang-shen"');
      return;
    }
    
    console.log('Query result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Optional: Save to file
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, `../output/${outputFile}.json`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\nData saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

// Run the query
queryPerson('person-data');