import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react()],

//   server: {
//     host: '192.168.15.7',
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });


server: {
  proxy: {
    '/api': {
      target: 'https://gym-bro-backend.vercel.app/',
      changeOrigin: true,
      secure: false,
    },
  },
},
});
