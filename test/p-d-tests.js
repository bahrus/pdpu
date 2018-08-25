var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const test = require('tape');
const puppeteer = require('puppeteer');
const path = require('path');
(() => __awaiter(this, void 0, void 0, function* () {
    console.log(__dirname);
    const browser = yield puppeteer.launch({
        headless: true,
        args: ['--allow-file-access-from-files']
    });
    const page = yield browser.newPage();
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    const devFile = path.resolve(__dirname, '../demo/dev.html');
    yield page.goto(devFile);
    const textContent = yield page.$eval('#secondEditor', (c) => c.input);
    yield page.screenshot({ path: 'example.png' });
    yield browser.close();
    test('testing dev.html', (t) => {
        t.equal(typeof Date.now, 'function');
        t.equal(textContent.data[0].name, 'Harry Potter');
        t.end();
    });
}))();
//# sourceMappingURL=p-d-tests.js.map