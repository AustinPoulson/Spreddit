import { credentials } from './Keys.js';
import axios from 'axios';
import { entries, subreddits } from './Config.js';

// Authenticate with Reddit API
async function authenticate(clientId, clientSecret, username, password, userAgent) {
  try {
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
      `grant_type=password&username=${username}&password=${password}`,
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': userAgent
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to authenticate:', error.message);
  }
}

// Make a post on Reddit
async function makePost(accessToken, subreddit, title, content, userAgent) {
  try {
    const response = await axios.post(`https://oauth.reddit.com/r/${subreddit}/api/submit`, 
      {
        title: title,
        kind: 'link',
        url: content
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': userAgent
        }
      }
    );
    interfaceLog(response);
  } catch (error) {
    return error;
  }
}

async function postFromRandomAccount(subreddit, title, content) {
  interfaceLog('Authenticating...');
  const {clientId, clientSecret, username, password, userAgent} = credentials[Math.floor(Math.random()*credentials.length)]
  const accessToken = await authenticate(clientId, clientSecret, username, password, userAgent);
  if (!accessToken) {
    interfaceLog('Authentication Failed');
    return
  }
  interfaceLog('Authentication Passed: ' + accessToken);
  makePost(accessToken, subreddit, title, content, userAgent)
    .then((response) => {return response})
    .catch((error) => {return error});
}

function formatTitle(entry, format) {
  for (var key in entry) {
    format = format.replace(key, entry.key);
  }
  return format;
}

function interfaceLog(log){
  console.log(log);
}

// Execute the script
(async () => {

  interfaceLog('Starting...');
  entries.forEach((entry) => {
    interfaceLog('Rolling dice');
    const chance = (Math.random() * 11);
    if (chance < entry.score) {
      interfaceLog('Dice roll passed, checking subreddit');
      const subredditName = entry.subreddits[Math.floor(Math.random()*entry.subreddits.length)];
      const subredditObj = subreddits.find(item => item.name === subredditName);
      if (subredditObj.restrictions !== []) {
        interfaceLog('Checking subreddit posting requirements');
        // TODO set limitations here
      }
      const title = formatTitle(entry, subredditObj.format);
      const content = entry.links[Math.floor(Math.random()*entry.links.length)];
      postFromRandomAccount(subredditName, title, content)
        .then(setTimeout(() => {}, 600000))
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
  })

})();