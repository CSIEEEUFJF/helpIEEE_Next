import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import vinext from 'vinext';
import { sites } from './hosting/sites-vite-plugin.mjs';

export default defineConfig({
  plugins: [
    vinext(),
    sites(),
    cloudflare({
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
      config: {
        main: './worker/index.js',
        compatibility_flags: ['nodejs_compat'],
      },
    }),
  ],
});
