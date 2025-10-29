/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom", 
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", 
  },
  moduleNameMapper: {
    "^pages/(.*)$": "<rootDir>/src/pages/$1",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy", 
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], 
};
