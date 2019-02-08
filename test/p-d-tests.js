const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    const textContent = await page.$eval('#secondEditor', (c) => c.input);
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing dev.html', (t) => {
        t.equal(textContent.data[0].name, 'Harry Potter');
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'demo/dev.html'
    }, customTests);
})();
