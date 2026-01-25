// @ts-check

const dateTime = new Date();
const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});
const dateString = dateFormatter
  .format(dateTime)
  .replace(/, /g, '_')
  .replace(/\//g, '-')
  .replace(/:/g, '-');
const reportName = `mutation_${dateString}`;

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

  tempDirName: 'stryker-tmp',
  ignorePatterns: ['stryker-tmp/**'],

  // @ts-ignore
  fileLogLevel: 'info',

  htmlReporter: {
    fileName: `reports/mutation/${reportName}.html`
  },
  jsonReporter: {
    fileName: `reports/mutation/${reportName}.json`
  },

  mutate: [
    // 'src/createActor.ts', // 270
    // 'src/StateMachine.ts', // 149
    // 'src/utils.ts', // 231
    // 'src/State.ts' // 116
    // 'src/StateNode.ts', // 166
    // 'src/stateUtils.ts', // 885
    // 'src/actions/send.ts' // 121
  ],

  mutator: {
    excludedMutations: ['BlockStatement']
  },
  ignoreStatic: true,

  timeoutFactor: 2,
  timeoutMS: 5 * 60 * 1000,

  vitest: {
    dir: './',
    related: true
  }
};
export default config;
