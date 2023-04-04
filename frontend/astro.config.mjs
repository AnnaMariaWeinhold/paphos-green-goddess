import { defineConfig } from 'astro/config';

import sanity from "astro-sanity";

// https://astro.build/config
export default defineConfig({
  integrations: [sanity({
    projectId: 'l2awlkjo',
    dataset: 'Yproduction',
    apiVersion: '2023-02-08',
    useCdn: false,
  })]
});