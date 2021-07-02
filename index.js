require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=d29f48606f3448e0a384`,
  );
});

app.get('/oauth-callback', (req, res) => {
  const requestToken = req.query.code;
  console.log(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${requestToken}`);
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    const accessToken = response.data.access_token;
    console.log('My token:', accessToken);
    res.redirect(`/?token=${accessToken}`);
  });
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');
