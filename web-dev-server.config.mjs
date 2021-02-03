import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  nodeResolve: true,
  plugins: [esbuildPlugin()],
  "preserve-symlinks": true,
  appIndex: "public/index.html",
};
