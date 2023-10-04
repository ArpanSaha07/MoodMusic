import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { OpenAI } from 'openai'
import "cohere-ai"

dotenv.config()

// console.log(process.env.OPENAI_API_KEY)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
// });
const cohere = require("cohere-ai");
cohere.init('rkFkHXfiEHRXu5Ni9uILfHckQMaloiCHH0ERVmN8');

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from MoodMusic!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await cohere.classify({
      model: 'embed-english-v2.0',
      inputs: [""],
      examples: [{"label": "Happy", "text": "I won a match today!"}, {"label": "Sad", "text": "I was hit by someone"}, {"label": "Happy", "text": "I received my paycheck today"}, {"label": "Happy", "text": "I am going on a vacation next week"}, {"label": "Sad", "text": "I missed my class"}, {"label": "Sooth", "text": "I can\'t sleep"}, {"label": "Sooth", "text": "I am feeling restless"}]
    });
    console.log(`The confidence levels of the labels are ${JSON.stringify(response.body.classifications)}`);

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       "role": "user",
    //       "content": `${prompt} \nDetect the mood of the text, and give your answer in json format of the three most likely moods and their probability only.`
    //     }
    //   ],
    //   temperature: 0.5,
    //   max_tokens: 256,
    //   top_p: 1,
    //   frequency_penalty: 0,
    //   presence_penalty: 0
    // });

    res.status(200).send({
      bot: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('MoodMusic server started on http://localhost:5000'))


// Spotify API
const token = 'BQCZ3iV9W-HciMrJzUigo27KFOarmmE_FQWkl5oCwI67ndXAoxm-59HXisickrSSOSCJgqa-Bal724N_xNeNW7GytWQ8dBWLiG-Zs2dome5PR5ViTPDoTtC7Pos4mkEpIvk2Wj6gYY6ke-EGCeOOaNftjlirtR_RBedCi06CjaZ_je4-pMiJat4Gwc42OuXn6OsxlE7SxhW8HPr0wf57KJmYx-_WNxlI_iFk8aAshfNPQeR2HL575ub1X9evBcT7_KsjTquEu4MVfqpfLCAwhNmm';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

const topTracksIds = [
  '0DgOpYaaJtM0MELwbHFAeT','30KctD1WsHKTIYczXjip5a','5nSWSCnhIgUDlxK4TX2wtT','6myUpr3GDR80Dg3zqNTmmG','2n7Ao4nyESBa5ti8gcAbBt'
];

async function getRecommendations(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
  )).tracks;
}

const recommendedTracks = await getRecommendations();
console.log(
  recommendedTracks.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);