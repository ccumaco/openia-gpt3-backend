const puppeteer = require('puppeteer');
const { makeAResumeOfProduct } = require('./openia')

const screenshot = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    await page.screenshot({ path: 'example.png' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await browser.close();
}

const searchInGoogle = async ({ query }) => {
    const url = 'https://www.google.com/search?q=' + query;
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('div#search a[data-ved]:not([class])');

    const urls = await page.evaluate(() => {
        const links = document.querySelectorAll('div#search a[data-ved]:not([class])') ?? [];
        const linksArray = [];
        links.forEach((link) => {
            console.log(link, 'link');
            if (!link) return; 
            linksArray.push({
                title: link.innerText,
                href: link.href,
            }); 
        });
        return linksArray;
    });

    await browser.close();
    console.log(urls.slice(0, 5), 'urls');
    // searchInEachPageParagraphs({ urls: urls.slice(0, 5), maxParagraphs: 3 });
    return urls;
}


const searchINMercadoLibre = async ({ query, justOne }) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto('https://listado.mercadolibre.com.co/' + query);
        const pageData = await page.evaluate(() => {
            const urls = [...document.querySelectorAll('.ui-search-result__content-wrapper .ui-search-item__group a.ui-search-item__group__element.ui-search-link')];
            console.log(urls, 'urls');
            let hrefs = [];
            if (urls) {
                hrefs = urls.map(a => a.href).slice(0, 5);
            }
            return { hrefs };
        }, query);
        await browser.close();
        return pageData;
    } catch (error) {
        await browser.close();
        console.error(error);
        return [];
    }
}
const searchInEachProduct = async ({ urls, justOne }) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const data = [];
    for (const url of urls) {
        try {
            const page = await browser.newPage();
            await page.goto(url);

            const pageData = await page.evaluate(() => {
                const title = document.querySelector('h1.ui-pdp-title')?.innerText ?? 'No title founded';
                const price = document.querySelector('.ui-pdp-price__second-line .andes-money-amount span.andes-money-amount__fraction')?.innerText ?? 'No price founded';
                const features = [...document.querySelectorAll('.ui-vpp-highlighted-specs__features-list li')] ?? [' No features founded '];
                const content = features?.map(p => {
                    if (p && p.innerText) {
                        return p.innerText;
                    }
                    return;
                }) ?? [];
                return {
                    title,
                    price,
                    content
                };
            });
            data.push({...pageData, url});
        } catch (error) {
            console.error(`Error processing URL: ${url.href}`, error.message);
            return [];
        }
    }
    // await new Promise(resolve => setTimeout(resolve, 1000));
    await browser.close();
    if (!justOne) return data;
    return data.slice(0, 1);
}

module.exports = {
    searchInGoogle,
    screenshot,
    searchInEachProduct,
    searchINMercadoLibre
}