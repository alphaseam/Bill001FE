import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },

    },
  },
});
