const puppeteer = require('puppeteer');
const { makeAResumeOfParagraphs } = require('./openia')

const screenshot = async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
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
        headless: 'new',
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
    searchInEachPageParagraphs({ urls: urls.slice(0, 5), maxParagraphs: 3 });
    return urls;
}


const searchInEachPageParagraphs = async ({ urls, maxParagraphs = 5 }) => {
    console.log('entrooo', urls.length);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const data = [];
    for (const url of urls) {
        try {
            const page = await browser.newPage();
            await page.goto(url.href);

            const pageData = await page.evaluate((maxParagraphs) => {
                const title = document?.querySelector('h1')?.innerText ?? 'No title';
                const paragraphs = [...document.querySelectorAll('p')].slice(0, maxParagraphs);
                const content = paragraphs?.map(p => {
                    if (p && p.innerText) {
                        return p.innerText;
                    }
                    return;
                }) ?? [];
                return {
                    title,
                    content,
                };
            }, maxParagraphs);

            data.push(pageData);
        } catch (error) {
            console.error(`Error processing URL: ${url.href}`, error.message);
            // Puedes agregar lógica adicional para manejar el error de la forma que desees.
        }
    }
    await browser.close();
    await makeAResumeOfParagraphs({ data })
    return data;
}

searchInGoogle({ query: 'televisores de 32 pulgadas' });

module.exports = {
    searchInGoogle,
    searchInEachPageParagraphs,
    screenshot,
}