import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";

export default {
  input: "app/javascript/application.js",
  output: {
    file: "app/assets/builds/application.js",
    format: "iife",
    // format: "es",
    inlineDynamicImports: true,
    // sourcemap: true
  },
  plugins: [
    // https://github.com/rollup/plugins/tree/master/packages/replace
    replace({
      values: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "process.env.HOST":
          process.env.NODE_ENV === "development"
            ? JSON.stringify("localhost:3000")
            : // ACTIONCABLE_HOST="obscure-project-react.herokuapp.com" in heroku
              JSON.stringify(process.env.ACTIONCABLE_HOST),
      },
      preventAssignment: true,
    }),
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".json"],
    }),
    json(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            useBuiltIns: "usage",
            corejs: "3.x",
          },
        ],
        [
          "@babel/preset-react",
          {
            runtime: "automatic",
          },
        ],
      ],
    }),
    // what's the truth? https://stackoverflow.com/a/52885295/744230 vs https://github.com/rollup/plugins/tree/master/packages/babel#using-with-rollupplugin-commonjs
    commonjs(),
  ],
};
