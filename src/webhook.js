const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const lib = require('./lib');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const client = new WebhookClient({ request, response });

  const showCandidates = async agent => {
    const list = await lib.fetchCandidatesList();

    agent.add(`Di seguito la lista dei candidati:\n${list}`);
  };

  const chooseCandidate = async agent => {
    const candidate = await lib.pickCandidate();

    agent.add(`Il candidato è: ${candidate.name} (@${candidate.username})`);
  };

  // Run the proper function handler based on the matched Dialogflow intent name
  const intentMap = new Map();
  intentMap.set('Lista candidati', showCandidates);
  intentMap.set('Scelta candidato', chooseCandidate);
  client.handleRequest(intentMap);
});
