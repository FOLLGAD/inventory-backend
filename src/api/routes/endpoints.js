import { Router } from 'express';
import { verifyToken } from '../middleware';
import { User } from '../models';
import { sharepointUrl } from '../../consts'

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/auth-url', (req, res) => {
		res.json({ authUrl: sharepointUrl })
	})

export default router;