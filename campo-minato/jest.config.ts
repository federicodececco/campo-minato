const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnviroment: "jsdom",
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
module.exports = createJestConfig(customJestConfig);
