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
    const textContent = await page.$eval('#secondEditor', (c: any) => c.input);
    //if(textContent){
        
    //}
    await page.screenshot({path: 'example.png'});
    console.log(textContent);
    await browser.close();
    test('testing dev.html', (t: any) => {
        
    
        t.equal(typeof Date.now, 'function');
        t.equal(textContent.data[0].name, 'Harry Potter');
        t.end();
    });
    
  })();

