import axios from 'axios';
import { getCachedAccessToken, getTokenExpiry, setCachedAccessToken, setTokenExpiry } from '../controllers/authController.js';

const { CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD } = process.env;

export const checkAuth = async (req, res, next) => {
  if (!getCachedAccessToken() || Date.now() >= getTokenExpiry()) {
    try {
      const url = 'https://euapi.ttlock.com/oauth2/token';
      const params = new URLSearchParams();
      params.append('clientId', CLIENT_ID);
      params.append('clientSecret', CLIENT_SECRET);
      params.append('username', USERNAME);
      params.append('password', PASSWORD);
      params.append('grant_type', 'password');

      const response = await axios.post(url, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      setCachedAccessToken(response.data.access_token);
      setTokenExpiry(Date.now() + response.data.expires_in * 1000);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get access token' });
    }
  }
  req.accessToken = getCachedAccessToken();
  next();
};