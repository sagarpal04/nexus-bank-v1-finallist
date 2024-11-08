import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react(), polyfillNode()],
  define: {
    "process.env.VITE_BASE_URL": JSON.stringify(process.env.VITE_BASE_URL),
  },
});
