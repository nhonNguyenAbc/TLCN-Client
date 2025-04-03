import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Đảm bảo đúng đường dẫn cơ sở
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
  },
});
