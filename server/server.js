import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import { Console } from 'console';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// start express
const app = express();
app.use(cors());
app.use(express.json());

//set get request for express app to recive data from frontend
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Welcome from Shazia',
    })
});

//set post method for express app which allow us to have body
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, //how much error risk
            max_tokens: 3000, //amount of response back
            top_p: 1,
            frequency_penalty: 0.5, //it will not repaet similer answers
            presence_penalty: 0,
        });
        //after getting the response now lets send it to frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})
//to make sure that server also Listen to our request 
app.listen(8888, () => console.log('Server is running on port http://localhost:8888'));