// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         secure: false,
//       },
//     },
//   },

//   plugins: [react()],
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  // Netlify ke liye proxy hatana hoga
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       secure: false,
  //     },
  //   },
  // },

  plugins: [react()],
  
  // Netlify ke liye important settings
  base: '/', // Ensures correct paths
  build: {
    outDir: 'dist', // Netlify expects this folder
    sourcemap: false, // Smaller build size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  
  // Optimize for production
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});