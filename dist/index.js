'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const simplecrawler_1 = __importDefault(require("simplecrawler"));
const log_update_1 = __importDefault(require("log-update"));
const iohook_1 = __importDefault(require("iohook"));
class Crawl {
    constructor(domain) {
        this.frames = ['-', '\\', '|', '/'];
        this.i = 0;
        this.urls = new Array();
        this.crawler = new simplecrawler_1.default(domain);
        this.crawledURLS = 0;
    }
    async start(options) {
        return new Promise(resolve => {
            console.log('Starting crawler... Press CTRL+X to stop the crawling process at any time');
            if (options) {
                this.crawler.maxConcurrency = 100;
                this.crawler.maxDepth = 0;
                this.crawler.stripQuerystring = true;
            }
            const maxUrls = options && options.maxUrls;
            let isRunning = true;
            let interval = setInterval(() => {
                const frame = this.frames[this.i = ++this.i % this.frames.length];
                log_update_1.default('Crawled ' + this.crawledURLS + ' pages ' + `${frame}`);
            }, 100);
            this.crawler.on('fetchcomplete', (item) => {
                if (item && item['stateData'] && item['stateData']['contentType'] &&
                    item['stateData']['contentType'].includes('text/html') &&
                    !this.urls.includes(item.url)) {
                    if (isRunning) {
                        this.urls.push(item.url);
                        const frame = this.frames[this.i = ++this.i % this.frames.length];
                        log_update_1.default('Crawled ' + this.crawledURLS++ + ' pages ' + `${frame}`);
                        if (typeof maxUrls === 'number' && maxUrls > 0 && this.urls.length >= maxUrls) {
                            isRunning = false;
                            clearInterval(interval);
                            this.crawler.emit('complete');
                        }
                    }
                }
            });
            this.crawler.on('complete', () => {
                this.stop();
                resolve();
                console.log('\nCrawler done!');
            });
            iohook_1.default.on('keydown', event => {
                if (event && event.ctrlKey && event.keycode === 45) {
                    isRunning = false;
                    clearInterval(interval);
                    this.crawler.emit('complete');
                    iohook_1.default.stop();
                }
            });
            iohook_1.default.start();
            this.crawler.start();
        });
    }
    stop() {
        this.crawler.stop();
    }
    getResults() {
        return this.urls;
    }
}
module.exports = Crawl;
