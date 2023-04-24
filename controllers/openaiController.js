const { Configuration, OpenAIApi } = require('openai');
require("dotenv").config()
const {
	generateHastag,
	softMessaje,
	getLenguaje,
	maxLengthText,
	getTitlePrompt,
	getMaxResponses,
	generateSeoWods,
	generateLikeHTML,
	likeEmail,
	addImages,
	explainLike
} = require('../querys/querysPrompt');
const User = require('../Models/Users');

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
		${generateLikeHTML()}
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
		res.status(200).send(allResponses);
	} catch (error) {
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
			n: 5,
			size: imageSize,
		});

		const imageUrl = response.data.data;

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
			soft,
			context
		} = req.body;
		prompt = `
        ${prompt}
        ${softMessaje(soft)}
      `;
	  console.log(prompt);
	  const contextJoin = context.join("\n");
	  console.log(contextJoin, 'contextJoin');
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: contextJoin + prompt,
			stream: false,
			top_p: 1,
			temperature: 1,
			max_tokens: 2000,
		});
		res.status(200).send(completion.data.choices[0].text);
	} catch (error) {
		console.log(error.message);
		res.status(400).send('algo a fallado');
	}
};
const generateLikeEmail = async (req, res) => {
	try {
		let {
			titlePrompt,
			prompt,
			language,
			soft
		} = req.body;
		prompt = `
		${likeEmail()}
        ${prompt}
		${getTitlePrompt(titlePrompt)}
        ${softMessaje(soft)}
        ${getLenguaje(language)}
		${generateLikeHTML()}
      `;
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			stream: false,
			top_p: 1,
			temperature: 1,
			max_tokens: 2000,
		});
		res.status(200).send(completion.data.choices[0].text);
	} catch (error) {
		res.status(400).send('algo a fallado');
	}
};
const generateArticle = async (req, res) => {
	try {
		let {
			prompt,
			maxLength,
			language,
			soft,
			keyWords,
			generateSeoKeyWords,
			generateImages
		} = req.body;
		prompt = `
        ${prompt}
        ${softMessaje(soft)}
        ${getLenguaje(language)}
        ${maxLengthText(maxLength)}
        ${generateSeoWods(generateSeoKeyWords, keyWords)}
		${addImages(generateImages)}
		${generateLikeHTML()}
      `;
	  console.log(prompt);
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			stream: false,
			top_p: 1,
			temperature: 0,
			max_tokens: 2000,
		});
		res.status(200).send(completion.data.choices[0].text);
	} catch (error) {
		res.status(400).send('algo a fallado', error);
	}
};
const generateResumes = async (req, res) => {
	try {
		
		let {
			prompt,
			maxLength,
			language,
			soft,
			whatToDo
		} = req.body;
		prompt = `
		${explainLike(whatToDo)}
        "${prompt}"
        ${softMessaje(soft)}
        ${getLenguaje(language)}
        ${maxLengthText(maxLength)}
		${generateLikeHTML()}
      `;
	  console.log(prompt);
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			stream: false,
			top_p: 1,
			temperature: 0,
			max_tokens: 2090,
		});
		res.status(200).send(completion.data.choices[0].text);
	} catch (error) {
		res.status(400).send('algo a fallado', error);
	}
};
const transcriptAudio = async (req, res) => {
	try {
		let {
			name,
			blobAudio,
			userEmail
		} = req.body;
		const user = await User.findOne({ where: { userEmail: userEmail } })
		console.log(user);
		console.log(blobAudio);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	generateImage,
	generateText,
	generateTextFree,
	generateArticle,
	generateLikeEmail,
	generateResumes,
	transcriptAudio
};
