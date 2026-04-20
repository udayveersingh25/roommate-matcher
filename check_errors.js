const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
        page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

        console.log('Navigating to http://localhost:5174/');
        await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
        
        console.log('Taking screenshot for verification (not strictly needed but ensuring page loaded)...');
        await browser.close();
    } catch (e) {
        console.error('PUPPETEER ERROR:', e);
    }
})();
