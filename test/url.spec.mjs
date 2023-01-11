import { Crawler } from '../dist/index.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { expect } from 'chai';

describe('Url crawling', function () {
  it('should have more than 1 urls', async function () {
    this.timeout(0);

    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({headless:false});
    const crawler = new Crawler(browser, 'https://www.gns.gov.pt');
    await crawler.crawl({ logging: false, maxDepth: 0 });
    const urls = crawler.getResults();
    console.log(urls);

    //await browser.close();

    expect(urls.length).to.be.greaterThan(1);
  });
});
