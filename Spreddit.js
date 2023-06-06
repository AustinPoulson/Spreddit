import { credentials } from './Keys.js';
import snoowrap from 'snoowrap';
import { entries, subreddits } from './Config.js';

// Authenticate with Reddit API
async function authenticate(clientId, clientSecret, username, password, userAgent) {
  try {
    return response = new snoowrap({
      userAgent,
      clientId,
      clientSecret,
      username,
      password
    });
  } catch (error) {
    interfaceLog('Failed to authenticate:' + error);
  }
}

// Make a post on Reddit
async function makePost(client, subreddit, title, content) {
  client.getSubreddit(subreddit).submitLink({
    title,
    url: content
  }).then((post) => {

    interfaceLog('Post submitted successfully');
    return post;
  }).catch((err) => {

    interfaceLog('Error submitting post');
    throw err;
  });
}

// Authenticate with an account on the list, then post from that account
async function postFromRandomAccount(subreddit, title, content) {
  interfaceLog('Authenticating...');
  const {clientId, clientSecret, username, password, userAgent} = credentials[Math.floor(Math.random()*credentials.length)]
  const client = await authenticate(clientId, clientSecret, username, password, userAgent);
  if (!client) {
    interfaceLog('Authentication Failed');
    return
  }
  interfaceLog('Authentication Passed');
  return makePost(client, subreddit, title, content)
    .catch((error) => {return error});
}

// Format the entry into a title
function formatTitle(entry, format) {
  for (var key in entry) {
    format = format.replace(key, entry[key]);
  }
  return format;
}

// Logging for the interface. This way we can differentiate between interface logs and debug logs.
function interfaceLog(log){
  console.log(log);
}

// Execute the script
(async () => {

  interfaceLog('Starting...');
  entries.forEach((entry) => {

    interfaceLog('Rolling dice');
    const chance = (Math.random() * 10);
    if (chance <= entry.score) {

      interfaceLog('Dice roll passed, checking subreddit');
      const subredditName = entry.subreddits[Math.floor(Math.random()*entry.subreddits.length)];
      const subredditObj = subreddits.find(item => item.name === subredditName);
      if (subredditObj) {
        if (subredditObj.restrictions !== []) {

          interfaceLog('Checking subreddit posting requirements');
          // TODO set limitations here

        }
        const title = formatTitle(entry, subredditObj.format);
        const content = entry.links[Math.floor(Math.random()*entry.links.length)];
        console.log(title);
        postFromRandomAccount(subredditName, title, content)
          .then(() => {
            interfaceLog('Pausing for rate limit');
            setTimeout(() => {}, 600000);
          })
          .catch((error) => interfaceLog(error));
      }
    }
  })

})();