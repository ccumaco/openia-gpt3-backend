require("dotenv").config()
const OpenAIApi = require('openai');
const { exampleProducts } = require("../examples/products");

const configuration = {
	apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAIApi(configuration);

function createSummary(data) {
    const summaryText = data.map(item => {
        const title = `${item.title}`;
        const price = `${item.price}`;
        const url = `${item.url}`;
        const content = item.content.length > 0 ? `Caracteristicas: ${item.content.join(', ')}` : 'No content available';
        console.log( `Titulo: ${title}\n
        Precio: ${price}\n
        Caracteristicas: ${content}\n
        URL: ${url}\n\n`);
        return `Titulo: ${title}\n
                Precio: ${price}\n
                Caracteristicas: ${content}\n
                URL: ${url}\n\n`;
    }).
   
join('\n');

    return summaryText;
}
const makeAResumeOfProduct = async ({ data = [], justOne = false, estimatePrice = 0 }) => {
    try {
        let textToStart = '';
        const justExample = "Estos son solo ejemplos de como responder, recuerda que eres un asesor de ventas y tienes conocimientos en productos";
        if (justOne) {
            textToStart = `segun esta informacion que producto es mejor y por que? tengo este presupuesto ${estimatePrice} COP y el uso aun no lo tengo definido,\n\n`
        }
        const prompt = createSummary(data);
        const exampleProductsString = exampleProducts.join('\n');
        console.log('a empezado a buscar');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            n: 1,
            max_tokens: 500,
            messages: [
                {
                    role:"system",
                    content: `${justExample} (${exampleProductsString}) ${textToStart}`,
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        });
        console.log('termino');
        return completion.choices[0].message.content
    } catch (error) {
        console.log(error);
        return 'algo a fallado';
    }
    }


module.exports = {
    makeAResumeOfProduct,
}