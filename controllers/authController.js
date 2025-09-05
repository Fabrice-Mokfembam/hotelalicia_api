import axios from 'axios';

const { CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD } = process.env;

let cachedAccessToken = null;
let tokenExpiry = null;

export const getAccessToken = async (req, res) => {
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

    cachedAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    res.json({ access_token: cachedAccessToken, expires_in: response.data.expires_in });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const getCachedAccessToken = () => cachedAccessToken;
export const getTokenExpiry = () => tokenExpiry;
export const setCachedAccessToken = (token) => { cachedAccessToken = token; };
export const setTokenExpiry = (expiry) => { tokenExpiry = expiry; };