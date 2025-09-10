import axios from 'axios';
import { getCachedAccessToken } from './authController.js';

const { CLIENT_ID } = process.env;


const apiClient = axios.create({
  timeout: 10000, 
});

export const listLocks = async (req, res) => {
  try {
    console.log('🔍 Starting lock list request...');
    
    const accessToken = getCachedAccessToken();
    console.log('Token status check:');
    console.log('  Cached token exists:', accessToken ? 'Yes' : 'No');
    console.log('  Token value:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
    
    if (!accessToken) {
      console.error('No access token available');
      console.log('Solution: Call POST /auth/token first to get an access token');
      return res.status(401).json({ 
        error: 'No access token available. Please call POST /auth/token first to authenticate.' 
      });
    }

    console.log('Access token found:', accessToken.substring(0, 10) + '...');

    const url = 'https://api.sciener.com/v3/lock/list';
    const params = new URLSearchParams();
    params.append('clientId', CLIENT_ID);
    params.append('accessToken', accessToken);
    params.append('pageNo', 1);
    params.append('pageSize', 20);
    params.append('date', Date.now().toString()); 

    console.log('Making request to:', url);
    console.log('Request params:', {
      clientId: CLIENT_ID,
      accessToken: accessToken.substring(0, 10) + '...',
      pageNo: 1,
      pageSize: 20,
      date: new Date().toISOString()
    });

    const response = await apiClient.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('Response received:', response.status);
    console.log('Response data:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error in listLocks:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
      return res.status(408).json({ error: 'Request timeout - API took too long to respond' });
    }
    console.error(' Error details:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};