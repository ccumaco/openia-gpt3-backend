require("dotenv").config()
const OpenAIApi = require('openai');
const configuration = {
	apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAIApi(configuration);


const makeAResumeOfParagraphs = async ({ data = [] }) => {
    console.log('data', data);
    const textToStart = 'dime caracteristicas de estos dispositivos \n\n'
    const prompt = data.map(p => p.content).join('\n\n');
    console.log(prompt, 'promptpro');
    const completion = await openai.completions.create({
        model: 'davinci',
        prompt: textToStart + prompt,
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
    makeAResumeOfParagraphs,
}