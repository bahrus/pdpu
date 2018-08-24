import { ConsoleMessage } from "puppeteer";

const test = require('tape');
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log(__dirname);
    const browser = await puppeteer.launch({
        headless: true,
        args:['--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    page.on('console', (msg: ConsoleMessage) => console.log('PAGE LOG:', msg.text()));
    const devFile = path.resolve(__dirname, '../demo/dev.html');
    await page.goto(devFile);
    await page.screenshot({path: 'example.png'});
    test('timing test', (t: any) => {
        t.plan(2);
    
        t.equal(typeof Date.now, 'function');
        var start = Date.now();
    
        setTimeout(function () {
            t.equal(Date.now() - start, 100);
        }, 100);
    });
    await browser.close();
  })();

