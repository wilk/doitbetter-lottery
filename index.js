const lib = require('./src/lib');

const lottery = async () => {
  const list = await lib.fetchCandidatesList();
  console.log(`Di seguito la lista dei candidati:\n${list}`);

  const candidate = await lib.pickCandidate();
  console.log(`Il candidato è: ${candidate.name} (@${candidate.username})`);
};

lottery();
