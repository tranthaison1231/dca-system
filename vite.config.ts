import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // @ts-ignore TODO: Fix type errors
  plugins: [sveltekit()],
});
