import 'dotenv/config';
import { createClient } from '@sanity/client';
import config from '../../sanity.config';

export const client = createClient({
  projectId: config.projectId!,
  dataset: config.dataset!,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
})