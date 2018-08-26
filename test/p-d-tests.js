var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const xt = require('xtal-test/index');
const test = require('tape');
function customTests(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const textContent = yield page.$eval('#secondEditor', (c) => c.input);
        const TapeTestRunner = {
            test: test
        };
        TapeTestRunner.test('testing dev.html', (t) => {
            t.equal(textContent.data[0].name, 'Harry Potter');
            t.end();
        });
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield xt.runTests({
        path: 'demo/dev.html'
    }, customTests);
}))();
//# sourceMappingURL=p-d-tests.js.map