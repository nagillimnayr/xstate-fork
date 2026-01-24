// @ts-check
const reportName = `mutation-${new Date().toLocaleDateString('en-CA')}`;

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'json'],
  testRunner: 'vitest',
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.',
  coverageAnalysis: 'perTest',
  plugins: ['@stryker-mutator/vitest-runner'],

  tempDirName: "stryker-tmp",
  ignorePatterns: [
    "stryker-tmp/**",
  ],

  // @ts-ignore
  fileLogLevel: 'info',

  htmlReporter: {
    fileName: `reports/mutation/${reportName}.html`,
  },
  jsonReporter: {
    fileName: `reports/mutation/${reportName}.json`,
  },

   mutate: [
    "src/createActor.ts",              // 270
    "src/StateMachine.ts",             // 149
    "src/utils.ts",                    // 231
    // "src/StateNode.ts",                // 166
    // "src/stateUtils.ts",               // 885
    "src/State.ts",                    // 116
    // "src/actions/send.ts",             // 121
  ],
  
  mutator: {
    excludedMutations: [
      // "BlockStatement",
    ],
  },
  ignoreStatic: true,
  
  timeoutFactor: 2,
  timeoutMS: 3 * 60 * 1000,
  
  vitest: {
    dir: './',
    related: true,
  }
   
};
export default config;
