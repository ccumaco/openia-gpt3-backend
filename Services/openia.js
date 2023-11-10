require("dotenv").config()
const OpenAIApi = require('openai');
const { exampleProducts } = require("../examples/products");

const configuration = {
	apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAIApi(configuration);

function createSummary(data) {
    const summaryText = data.map(item => {
        const title = `Title: ${item.title}`;
        const price = `Price: ${item.price}`;
        
       
const content = item.content.length > 0 ? `Content: ${item.content.join(', ')}` : 'No content available';
        return `${title}\n${price}\n${content}\n\n`;
    }).
   
join('\n');

    return summaryText;
}
const makeAResumeOfProduct = async ({ data = [] }) => {
    
    console.log('data', data);
    const textToStart = 'segun esta informacion que producto es mejor y por que? \n\n'

    const prompt = createSummary(data)
    console.log(prompt, 'promptpro');
    const completion = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: textToStart + prompt + 'estos son ejemplos de como deberias responder \n\n' + exampleProducts[0],
        stream: false,
        max_tokens: 100,
        n: 1,
    });
    console.log(completion, 'completioncompletioncompletioncompletion');
    console.log(completion.choices[0].text, 'completion');
    return {
        content: completion.choices[0].text,
    };
}


module.exports = {
    makeAResumeOfProduct,
}