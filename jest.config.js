module.exports = {
  verbose: false,
  preset: "ts-jest",
  moduleFileExtensions: ["js", "json", "ts", "jsx", "tsx"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.tsx?$",
  globals: {
    "ts-jest": {
      astTransformers: {
        before: ["./src/jest-import-transformer"],
      },
    },
  },
};
