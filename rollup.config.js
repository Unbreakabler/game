// rollup.config.js
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import sveltePreprocess from "svelte-preprocess";

export default {
  input: "src/index.js",
  output: {
    name: "app",
    sourcemap: true,
    dir: "public/build",
    format: "es",
  },
  //NOTE: Enable node_modules and src imports to keep in original files and location
  preserveModules: true,
  plugins: [
    svelte({
      // By default, all ".svelte" files are compiled
      extensions: [".svelte"],

      // You can restrict which files are compiled
      // using `include` and `exclude`
      include: "src/**/*.svelte",

      // Optionally, preprocess components with svelte.preprocess:
      // https://svelte.dev/docs#svelte_preprocess
      preprocess: sveltePreprocess(),

      // Emit CSS as "files" for other plugins to process. default is true
      emitCss: false,

      // Warnings are normally passed straight to Rollup. You can
      // optionally handle them here, for example to squelch
      // warnings with a particular code
      onwarn: (warning, handler) => {
        // e.g. don't warn on <marquee> elements, cos they're cool
        if (warning.code === "a11y-distracting-elements") return;

        // let Rollup handle all other warnings normally
        handler(warning);
      },

      // You can pass any of the Svelte compiler options
      compilerOptions: {
        // By default, the client-side compiler is used. You
        // can also use the server-side rendering compiler
        // generate: 'ssr',

        // ensure that extra attributes are added to head
        // elements for hydration (used with generate: 'ssr')
        // hydratable: true,

        // You can optionally set 'customElement' to 'true' to compile
        // your components to custom elements (aka web elements)
        customElement: false,
      },
    }),
    // see NOTICE below
    resolve({ browser: true, dedupe: ["svelte"] }),
    // ...
    typescript({ sourceMap: true }),
  ],
};
