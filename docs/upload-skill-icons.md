# Upload Skill Icons to Sanity

This guide explains how to upload SVG icons from the `data/skill-icons` folder to your Sanity Studio as `skillIcon` documents.

## Prerequisites

1. **Get a Sanity API Token:**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Go to "API" tab
   - Create a new token with "Editor" permissions
   - Copy the token

2. **Set Environment Variable:**
   ```bash
   export SANITY_API_TOKEN="your-token-here"
   ```
   Alternative `.env`
   ```
   SANITY_API_TOKEN=your-token-here
   ```
   - need to install `dotenv` package and use it in your script.
   - `npm install dotenv`
   ```ts
   import 'dotenv/config'; // add this line at the top.
   ```

## Using TypeScript

```bash
# Install dependencies if needed
npm install @sanity/client
npm install -D tsx

# Run the TypeScript upload script
npx tsx upload-skill-icons.ts
```

## What the Script Does

1. **Reads SVG Files:** Scans the `data/skill-icons` directory for `.svg` files
2. **Extracts Names:** Uses the `<title>` tag from SVG content as the skill name, or falls back to filename
3. **Creates Documents:** Creates `skillIcon` documents in Sanity with:
   - `_id`: Generated from skill name (e.g., `skillIcon-python`)
   - `_type`: `skillIcon`
   - `name`: Extracted skill name
   - `icon`: Full SVG content
4. **Avoids Duplicates:** Checks if documents already exist before creating new ones

## Expected Output

```
Found 54 SVG files to upload
✅ Created skillIcon: AWS
✅ Created skillIcon: Azure
✅ Created skillIcon: CSS
...
🎉 Skill icons upload completed!
```

## Troubleshooting

- **Authentication Error:** Make sure `SANITY_API_TOKEN` is set correctly
- **Permission Error:** Ensure your API token has "Editor" permissions
- **File Not Found:** Verify the `data/skill-icons` directory exists and contains SVG files
- **Validation Error:** Check that SVG files are valid and contain proper `<svg>` tags

## Viewing Results

After running the script, you can:
1. Open Sanity Studio
2. Navigate to "Skill" documents
3. See all your uploaded skill icons with previews