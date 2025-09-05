import express from 'express';
import { listLocks } from '../controllers/lockController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', checkAuth, listLocks);

export default router;