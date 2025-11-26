export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    specs: ['./features/**/*.feature'],
    exclude: [],

    maxInstances: 10,

    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--no-sandbox',
                '--lang-en-US',
                '--start-maximized',
            ]
        }
    }],

    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://sdk.openui5.org',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['@sap_oss/wdio-qmate-service'],

    framework: 'cucumber',

    reporters: [['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true
    }]],

    cucumberOpts: {
        require: [
            './step-definitions/*.ts',
            './support/world.ts'
        ],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        name: [],
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    beforeScenario: async function (world: any) {
        const allure = require('@wdio/allure-reporter').default;
        allure.addFeature(world.pickle.name);
        if (world.pickle.parameters) {
            world.pickle.parameters.forEach((param: any) => {
                allure.addParameter(param.name, param.value);
            });
        }
    },

    afterScenario: async function () {
        await util.browser.clearBrowser();
    },

    afterTest: async function (_test, _context, { passed }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },
}
