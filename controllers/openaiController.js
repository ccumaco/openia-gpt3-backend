const { Configuration, OpenAIApi } = require('openai');
require("dotenv").config()
const {
	generateHastag,
	softMessaje,
	getLenguaje,
	maxLengthText,
	getTitlePrompt,
	getMaxResponses,
} = require('../querys/querysPrompt');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateText = async (req, res) => {
	try {
		let {
			top_p,
			prompt,
			maxLength,
			language,
			soft,
			hashtag,
			maxResponses,
			automaticHastag,
			countHashtag,
		} = req.body;
		prompt = `
        ${prompt}
        ${softMessaje(soft)}
        ${getLenguaje(language)}
        ${maxLengthText(maxLength)}
        ${generateHastag(automaticHastag, hashtag, countHashtag)}
      `;
		const allResponses = [];
		for (let i = 0; i < getMaxResponses(maxResponses); i++) {
			const completion = await openai.createCompletion({
				model: 'text-davinci-003',
				prompt: prompt,
				stream: false,
				top_p: 1,
				temperature: 1,
				max_tokens: 2000,
			});
			allResponses.push(completion.data.choices[0].text);
		}
		console.log(allResponses, 'allResponses');
		res.status(200).send(allResponses);
	} catch (error) {
		console.error(error.message);
		res.status(400).send('algo a fallado', error);
	}
};
const generateImage = async (req, res) => {
	const { prompt, size } = req.body;

	const imageSize =
		size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

	try {
		const response = await openai.createImage({
			prompt,
			n: 1,
			size: imageSize,
		});

		const imageUrl = response.data.data[0].url;

		res.status(200).json({
			success: true,
			data: imageUrl,
		});
	} catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}

		res.status(400).json({
			success: false,
			error: 'The image could not be generated',
		});
	}
};
const generateTextFree = async (req, res) => {
	try {
		let {
			prompt,
			language,
			soft,
			titlePrompt
		} = req.body;
		prompt = `
        ${prompt}
		${getTitlePrompt(titlePrompt)}
        ${softMessaje(soft)}
        ${getLenguaje(language)}
      `;
	  console.log(prompt);
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			stream: false,
			top_p: 1,
			temperature: 1,
			max_tokens: 2000,
		});
		console.log(completion.data.choices[0].text);
		res.status(200).send(completion.data.choices[0].text);
	} catch (error) {
		console.error(error.message);
		res.status(400).send('algo a fallado');
	}
};

module.exports = { generateImage, generateText, generateTextFree };
