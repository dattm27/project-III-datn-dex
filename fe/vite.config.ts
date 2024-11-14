import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || "3000")
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src/")
    }
  }
});
