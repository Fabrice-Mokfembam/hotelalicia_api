import express from 'express';
import { getAccessToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/token', getAccessToken);

export default router;