import resolve from "@rollup/plugin-node-resolve"
import commonjs from '@rollup/plugin-commonjs';
import { babel } from "@rollup/plugin-babel";
import replace from '@rollup/plugin-replace';

export default {
  input: "app/javascript/application.js",
  output: {
    file: "app/assets/builds/application.js",
    format: "es",
    inlineDynamicImports: true
  },
  plugins: [
    // https://github.com/rollup/plugins/tree/master/packages/replace
    replace({
      values: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      },
      preventAssignment: true
    }),
    resolve(),

    babel({
      babelHelpers: 'bundled',
      exclude: "node_modules/**",
      presets: [
        ["@babel/preset-env", {
          "useBuiltIns": "usage",
          "corejs": "2.x"
        }], 
        ["@babel/preset-react", {
          "runtime": "automatic"
        }]
      ],
    }),
    // what's the truth? https://stackoverflow.com/a/52885295/744230 vs https://github.com/rollup/plugins/tree/master/packages/babel#using-with-rollupplugin-commonjs
    commonjs(),
  ]
}
