// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.',
  coverageAnalysis: 'perTest',
  plugins: ['@stryker-mutator/vitest-runner'],

  tempDirName: "stryker-tmp",
  ignorePatterns: [
    "stryker-tmp/**",
  ],

  htmlReporter: {
    fileName: "reports/mutation/mutation.html",
  },

   mutate: [
    "src/createActor.ts",
  ],
  
  mutator: {
    excludedMutations: [
      // "StringLiteral",
      "BlockStatement",
    ],
  },
  ignoreStatic: true,
  
  timeoutFactor: 2,
  timeoutMS: 3 * 60 * 1000,
  
  vitest: {
    dir: './test',
    related: true,
  }
   
};
export default config;
