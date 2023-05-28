const { Configuration, OpenAIApi } = require('openai');
require("dotenv").config()
const {
	generateHashtag,
	softMessage,
	getLanguage,
	maxLengthText,
	getTitlePrompt,
	getMaxResponses,
	generateSeoWords,
	generateLikeHTML,
	likeEmail,
	addImages,
	explainLike
} = require('../querys/querysPrompt');
const User = require('../Models/Users');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { Readable } = require('stream');


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
        ${softMessage(soft)}
        ${getLanguage(language)}
        ${maxLengthText(maxLength)}
        ${generateHashtag(automaticHastag, hashtag, countHashtag)}
		
      `;
		const allResponses = [];
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			stream: false,
			top_p: 1,
			temperature: 1,
			max_tokens: 2000,
			n: getMaxResponses(maxResponses)
		});
		console.log('mi propt al generar post', prompt);
		for (let i = 0; i < getMaxResponses(maxResponses); i++) {
			const response = completion.data.choices[i];
			allResponses.push(response.text);
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

function transformData(dataString) {
	if (dataString === "data: [DONE]") return [];
	const dataArray = dataString.split('\n');
	const dataObjects = dataArray.map((dataItem) => {
	  const jsonStartIndex = dataItem.indexOf('{');
	  if (jsonStartIndex !== -1) {
		const jsonString = dataItem.substring(jsonStartIndex);
		try {
		  const decodedString = decodeURIComponent(jsonString);
		  return JSON.parse(decodedString);
		} catch (error) {
		  console.error('Error parsing JSON:', error);
		  return null;
		}
	  } else {
		return null;
	  }
	});
  
	const contentArray = dataObjects.map((dataObj) => {
	  if (dataObj && dataObj.choices && dataObj.choices.length > 0) {
		return dataObj.choices[0].delta.content;
	  } else {
		return null;
	  }
	});
  
	const filteredContentArray = contentArray.filter((content) => {
	  return content !== undefined && content !== null;
	});
  
	return filteredContentArray;
  }
  


const generateTextFree = async (req, res) => {
	try {
		const { context } = req.body;
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.flushHeaders();
		const completion = openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: context.slice(-5),
		  	max_tokens: 4000,
		  	temperature: 0,
		  	stream: true,
		}, { responseType: 'stream' });
		
		completion.then(resp => {
		  resp.data.on('data', data => {
			console.log({
				miInfo: transformData(data.toString())
			});
			if (transformData(data.toString())[0]) {
				res.write(transformData(data.toString())[0])
			} else {
				console.log('aqui fallo');
				res.end();
				return;
			}
		  });
		});
	} catch (error) {
		if (error.response?.status) {
			console.error(error.response.status, error.message);
			error.response.data.on('data', data => {
				const message = data.toString();
				try {
					const parsed = JSON.parse(message);
					console.error('An error occurred during OpenAI request: ');
				} catch(error) {
					console.error('An error occurred during OpenAI request: ');
				}
			});
		} else {
			console.error('An error occurred during OpenAI request');
		}
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
        ${softMessage(soft)}
        ${getLanguage(language)}
		
      `;
	  console.log('mi propt al generar email', prompt);
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
        ${softMessage(soft)}
        ${getLanguage(language)}
        ${maxLengthText(maxLength)}
        ${generateSeoWords(generateSeoKeyWords, keyWords)}
		${addImages(generateImages)}
		
      `;
		console.log('mi propt al generar articulos', prompt);
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
        ${softMessage(soft)}
        ${getLanguage(language)}
        ${maxLengthText(maxLength)}
		
      `;
	  console.log('mi propt al generar resumenes', prompt);
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

// Configurar multer para que guarde el archivo en el disco
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
})
const upload = multer({ storage: storage })

const transcriptAudio = async (req, res) => {
	try {
		const blobAudio = req.file.buffer;
		// Convertir blob a buffer
		const audio = Buffer.from(blobAudio);

		// Guardar archivo en formato mp3
		fs.writeFileSync('audio.mp3', audio);

		// Crear instancia de FormData
		const formData = new FormData();
		formData.append('file', Readable.from(audio), {
		  filename: 'audio.mp3',
		  contentType: 'audio/mpeg',
		});
		formData.append('model', 'whisper-1');
		
		const headers = {
		  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		  ...formData.getHeaders(),
		  'Content-Type': 'multipart/form-data' // Agregar Content-Type
		};
		
		const response = await axios.post(
		  'https://api.openai.com/v1/audio/transcriptions',
		  formData,
		  {
			headers: headers
		  }
		);
		res.status(200).send({data: response.data.text});
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
};



module.exports = {
	generateImage,
	generateText,
	generateTextFree,
	generateArticle,
	generateLikeEmail,
	generateResumes,
	transcriptAudio
};
