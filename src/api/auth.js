import { Router } from 'express';
import { getToken, basicToCredentials } from './middleware';

let router = new Router();

router
    .get('/', (req, res) => {
        let { username, password } = basicToCredentials(req.headers.authorization);
        getToken(username, password).then(token => {
            res.status(200).json({ token });
        }).catch(err => {
            res.status(err.status || 400).json({ errors: [err] });
        });
    })

export default router;