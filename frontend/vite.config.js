import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://13.201.49.160:4000",
        changeOrigin: true,
      },
      "/media": {
        target: "http://13.201.49.160:4000",
        changeOrigin: true,
      },
    },
  },
});
