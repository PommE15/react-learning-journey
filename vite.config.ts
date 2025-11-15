import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  // Only set base path for production build
  // base: process.env.NODE_ENV === 'production' ? '/react-learning-journey/' : '/',
  base: "/react-learning-journey/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  css: {
    postcss: {
      plugins: [
        // Optional: Add autoprefixer if needed
      ],
    },
  },
});
