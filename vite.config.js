import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ecommerce/', // Correct base path for GitHub Pages
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // Ensure PWA assets are copied to the dist directory
  publicDir: 'public',
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      }
    }
  }
})
