import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginImp from "vite-plugin-imp";
import path from "path";

// https://vitejs.dev/config/
const pathSrc = path.resolve(__dirname, "./src");

export default defineConfig({
  envPrefix: "API_",
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "@nutui/nutui-react",
          style: (name) => {
            return `@nutui/nutui-react/dist/esm/${name}/style/css`;
          },
          replaceOldImport: false,
          camel2DashComponentName: false,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": pathSrc,
    },
  },
});
