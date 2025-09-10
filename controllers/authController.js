import axios from 'axios';

const CLIENT_ID="e18c6516a6754009aacc0a027feea4b4"
const CLIENT_SECRET="d56d12c02545e731de8659b4ba8e5c2e"
const USERNAME="h_1750496157564"
const PASSWORD="790daf6d70cc80dced13bc4598d36d59"

let cachedAccessToken = null;
let tokenExpiry = null;

export const getAccessToken = async (req, res) => {
  try {
    console.log('🔐 Starting authentication request...');
  
    
    const url = 'https://api.sciener.com/oauth2/token';
    const params = new URLSearchParams();
    params.append('clientId', CLIENT_ID);
    params.append('clientSecret', CLIENT_SECRET);
    params.append('username', USERNAME);
    params.append('password', PASSWORD);
    params.append('grant_type', 'password');

    console.log('📡 Making auth request to:', url);
    console.log('👤 Using username:', USERNAME);

    const response = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000 // 10 seconds timeout
    });

    console.log('Authentication successful');
    cachedAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    res.json({ access_token: cachedAccessToken, expires_in: response.data.expires_in });
  } catch (error) {
    console.error('Authentication failed:', error.message);
    console.error('Auth error details:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const getCachedAccessToken = () => cachedAccessToken;
export const getTokenExpiry = () => tokenExpiry;
export const setCachedAccessToken = (token) => { cachedAccessToken = token; };
export const setTokenExpiry = (expiry) => { tokenExpiry = expiry; };