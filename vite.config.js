// import dotenv from 'dotenv'
// dotenv.config()

import { resolve } from 'path'
import { defineConfig } from 'vite'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const { PORT = 3001 } = process.env

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // const DEV = mode === 'development'
    const DEV = true

    return {
        publicDir: resolve(__dirname, 'www/assets/dist'),
        resolve: {
            alias: {
                '@': resolve(__dirname, 'public/src'),
                '~': resolve(__dirname, 'node_modules'),
            },
        },
        build: {
            outDir: 'www/assets/dist',
            emptyOutDir: true,
            minify: DEV ? false : 'esbuild',
            rollupOptions: {
                // only needed for local library development
                plugins: [nodeResolve()],
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                // external: [],
                input: {
                    app: resolve(__dirname, 'public/src/app.js')
                },
                output: {
                    manualChunks: undefined,
                    chunkFileNames: DEV ? '[name].js' : '[name]-[hash].min.js',
                    entryFileNames: DEV ? '[name].js' : '[name].[hash].min.js',
                    assetFileNames: DEV ? '[name].[ext]' : '[name].[hash].min.[ext]',
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    // globals: {
                    //     // vue: 'Vue'
                    // }
                }
            }
        }
    }
})
