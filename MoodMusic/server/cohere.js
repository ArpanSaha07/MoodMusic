import "cohere-ai"

cohere.init('rkFkHXfiEHRXu5Ni9uILfHckQMaloiCHH0ERVmN8');
(async () => {
  const response = await cohere.classify({
    model: 'embed-english-v2.0',
    inputs: [""],
    examples: [{"label": "Happy", "text": "I won a match today!"}, {"label": "Sad", "text": "I was hit by someone"}, {"label": "Happy", "text": "I received my paycheck today"}, {"label": "Happy", "text": "I am going on a vacation next week"}, {"label": "Sad", "text": "I missed my class"}, {"label": "Sooth", "text": "I can\'t sleep"}, {"label": "Sooth", "text": "I am feeling restless"}]
  });
  console.log(`The confidence levels of the labels are ${JSON.stringify(response.body.classifications)}`);
})();