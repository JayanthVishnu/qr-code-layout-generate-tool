import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        svelte({ hot: false }),
        dts({ insertTypesEntry: true })
    ],
    build: {
        lib: {
            entry: {
                'svelte-qr-label': path.resolve(__dirname, 'src/index.ts'),
                'pdf': path.resolve(__dirname, 'src/pdf.ts')
            },
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: (id) =>
                id === 'svelte' ||
                id.startsWith('svelte/') ||
                id === 'qrlayout-core' ||
                id.startsWith('qrlayout-core/') ||
                id === 'qrlayout-ui',
            output: {
                globals: {
                    svelte: 'Svelte',
                    'qrlayout-core': 'QRLayoutCore',
                    'qrlayout-ui': 'QRLayoutUI'
                }
            }
        }
    }
});
