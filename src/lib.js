const Twit = require('twit');
const dotenv = require('dotenv');

dotenv.config();

const twit = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_API_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

const TWEET_IDS = (process.env.TWEET_IDS || '').split(',');
const ORGANIZERS = (process.env.DIB_ORGANIZERS || '').split(',');

const fetchCandidates = async () => {
  const results = await Promise.all(TWEET_IDS.map(id => twit.get(`statuses/retweets/${id}`)));
  // merge results
  const candidates = results.reduce((acc, result) => {
    acc.push(...result.data);
    return acc;
  }, [])
    // remove organizers
    .filter(({ user: { screen_name: username } }) => !ORGANIZERS.includes(username))
    // pick just username and name
    .map(({ user: { screen_name: username, name } }) => ({ username, name }))
    // remove duplicates
    .reduce((acc, candidate) => {
      if (acc.findIndex(c => c.username === candidate.username) === -1) acc.push(candidate);
      return acc;
    }, []);

  return candidates;
};

const fetchCandidatesList = async () => {
  const list = (await fetchCandidates())
    .map(({ username, name }) => `${name} (@${username})`)
    .join('\n');

  return list;
};

const pickCandidate = async () => {
  const candidates = await fetchCandidates();
  const candidate = candidates[Math.floor(Math.random() * candidates.length)];

  return candidate;
};

module.exports = {
  fetchCandidatesList,
  pickCandidate,
};
