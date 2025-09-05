import axios from 'axios';
import { getCachedAccessToken } from './authController.js';

const { CLIENT_ID } = process.env;

export const listLocks = async (req, res) => {
  try {
    const url = 'https://euapi.ttlock.com/v3/lock/list';
    const params = new URLSearchParams();
    params.append('clientId', CLIENT_ID);
    params.append('accessToken', getCachedAccessToken());
    params.append('pageNo', 1);
    params.append('pageSize', 20);

    const response = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};