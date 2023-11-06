require("dotenv").config()
const OpenAIApi = require('openai');
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
	explainLike,
	validateIfIsQuery
} = require('../querys/querysPrompt');
const { clearPromptSql } = require('../querys/sqlPrompts');
const User = require('../Models/Users');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { Readable } = require('stream');


const configuration = {
	apiKey: process.env.OPENAI_API_KEY,
};
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
	if (dataString === "data: [DONE]") {
		return [];
	}

	const dataArray = dataString.split('\n');

	const filteredContentArray = dataArray
		.map((dataItem) => {
			const jsonStartIndex = dataItem.indexOf('{');
			if (jsonStartIndex !== -1) {
				const jsonString = dataItem.substring(jsonStartIndex);
				try {
					const parsedJson = JSON.parse(jsonString);
					return parsedJson;
				} catch (error) {
					console.error('Error parsing JSON:', error);
				}
			}
			return null;
		})
		.filter((dataObj) => dataObj && dataObj.choices && dataObj.choices.length > 0)
		.map((dataObj) => dataObj.choices[0].delta.content)
		.filter((content) => content !== undefined && content !== null)
		.map((content) => {
			try {
				return decodeURIComponent(content);
			} catch (error) {
				console.error('Error decoding content:', error);
				return content;
			}
		});

	if (filteredContentArray.length > 0) {
		filteredContentArray.push("%");
	}

	return filteredContentArray;
}


const generateTextFree = async (req, res) => {
	try {
		const { context } = req.body;
		// context[context.length - 1].content = validateIfIsQuery(context[context.length - 1].content) + context[context.length - 1].content;
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			n: 1,
			messages: context,
		});
		const response = completion.choices[0].message.content;
		res.status(200).send({
			response
		});
		//this is if you want to use the stream
		//   completion.then(resp => {
		// 	resp.data.on('data', data => {
		// 	  const transformedData = transformData(data.toString());
		// 	  if (transformedData[0]) {
		// 		finalString += transformedData[0];
		// 		res.write(transformedData[0]);
		// 	  }
		// 	});

		// 	resp.data.on('end', () => {
		// 	  console.log({
		// 		context,
		// 		finalString
		// 	  });
		// 	  console.log(validateIfIsQuery(finalString), 'validateIfIsQuery(finalString)');
		// 	  res.end();
		// 	});
		//   });
	} catch (error) {
		console.error('An error occurred:', error.message);

		// Envía una respuesta de error al cliente
		res.status(500).send('Ha ocurrido un error en el servidor');
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
		res.status(200).send({ data: response.data.text });
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
