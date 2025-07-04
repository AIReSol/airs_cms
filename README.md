# Overview
Sanity studio for MLReSol


## Introduction

To run the sanity studio
```bash
npm run dev
```

# Getting started 

1. Create a Sanity Studio project
```bash
cd sanity-studio
npm create sanity@latest -- --dataset production --template clean --typescript --output-path .

# you may may need to update sanity later  
npm update sanity @sanity/vision
```

2. define schemas

Under `schemaTypes/` define schemas for your content.

3. write GROQ query

Example:
```
*[_type == "post"]{
  _id,
  title,
  slug,
  publishedAt
}
```

# Deployment

```bash
npm run deploy
```
