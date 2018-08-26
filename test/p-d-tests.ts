import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
import { Page } from "puppeteer"; //typescript
import { Test } from "tape";
async function customTests(page: Page) {
    const textContent = await page.$eval('#secondEditor', (c: any) => c.input);
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test('testing dev.html', (t: any) => {
        t.equal(textContent.data[0].name, 'Harry Potter');
        t.end();
    });

}

(async () => {
    await xt.runTests({
        path: 'demo/dev.html'
    }, customTests);
})();

