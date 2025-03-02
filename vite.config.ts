import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import { barrel } from "vite-plugin-barrel";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        barrel({ packages: ["lucide-react"] }),
        tailwind(),
    ],
});
