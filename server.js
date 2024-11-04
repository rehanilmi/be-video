// server.js
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const app = express();

const accountSid = process.env.twilio_sid;
const apiKeySid = process.env.twilio_keySid;
const apiKeySecret = process.env.twilio_keySecret;

app.get('/token', (req, res) => {
  const identity = req.query.identity;
  const roomName = req.query.roomName;

  if (!identity) {
    return res.status(400).json({ error: 'Identity is required' });
  }
  if (!roomName) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  console.log("Creating Access Token for identity:", identity);

  const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, { identity });
  token.identity = identity;

  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  res.json({ token: token.toJwt() });
});

// Ekspor aplikasi Express untuk digunakan oleh Vercel
module.exports = app;
