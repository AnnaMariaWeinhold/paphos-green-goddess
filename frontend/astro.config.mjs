import { defineConfig } from 'astro/config';
import sanity from "@sanity/astro";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.paphosgreengoddess.com',
  integrations: [sanity({
    projectId: 'l2awlkjo',
    dataset: 'production',
    apiVersion: '2023-02-08',
    useCdn: false
  }), react()]
});