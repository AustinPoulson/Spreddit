import { credentials } from './Keys.js';
import axios from 'axios';

//const axios = require('axios');

// Reddit API credentials
const clientId = credentials.clientId;
const clientSecret = credentials.clientSecret;
const username = credentials.username;
const password = credentials.password;
const userAgent = credentials.userAgent;

// Authenticate with Reddit API
async function authenticate() {
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
async function makePost(accessToken, subreddit, title, content) {
  try {
    const response = await axios.post(`https://oauth.reddit.com/r/${subreddit}/api/submit`, 
      {
        title: title,
        kind: 'self',
        text: content
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': userAgent
        }
      }
    );
    console.log('Post created successfully:', response.data);
  } catch (error) {
    console.error('Failed to create post:', error.message);
  }
}

// Execute the script
(async () => {

  const accessToken = await authenticate();
  if (!accessToken) {return}
  else {
    console.log('Connected');
    return;
  }

  const subreddit = 'YOUR_SUBREDDIT'; // Replace with the subreddit you want to post to
  const title = 'My Awesome Post';
  const content = 'Hello, Reddit! This is my first post using a Node.js script.';
  await makePost(accessToken, subreddit, title, content);

})();