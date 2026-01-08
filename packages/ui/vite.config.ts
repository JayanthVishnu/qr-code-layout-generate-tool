import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true })],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'QRLayoutUI',
            fileName: (format) => `qrlayout-ui.${format === 'es' ? 'js' : 'umd.js'}`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['qrlayout-core'],
            output: {
                globals: {
                    'qrlayout-core': 'QRLayoutCore'
                }
            }
        }
    },
    resolve: {
        alias: {
            '@qrlayout/core': path.resolve(__dirname, '../core/src/index.ts')
        }
    },
    server: {
        fs: {
            allow: ['..']
        }
    }
});
