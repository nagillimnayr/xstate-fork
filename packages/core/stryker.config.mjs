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
    // "src/createActor.ts",              // 270
    // "src/StateMachine.ts",             // 149
    // "src/utils.ts",                    // 231
    // "src/StateNode.ts",                // 166
    // "src/stateUtils.ts",               // 885
    // "src/State.ts",                    // 116

    // "src/actions/send.ts",             // 121
    // "src/actions/assign.ts",           // 33
    // "src/actions/raise.ts",            // 56
    // "src/actions/enqueueActions.ts",   // 21
    // "src/actions/spawnChild.ts",       // 46
    // "src/actions/stopChild.ts",        // 39

    // "src/actors/callback.ts",          // 32
    // "src/actors/observable.ts",        // 84
    // "src/actors/promise.ts",           // 49
    // "src/actors/transition.ts",        // 14

    // 'src/graph/graph.ts',              // 60
  ],
  
  mutator: {
    excludedMutations: [
      // "StringLiteral",
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
