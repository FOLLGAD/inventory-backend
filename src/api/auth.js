import { Router } from 'express';
import { getToken, basicToCredentials } from './middleware';

let router = new Router();
router
    .get('/', (req, res) => {
        let { username, password } = basicToCredentials(req.headers.authorization);
        getToken(username, password).then(token => {
            console.log(token)
        }).catch(err => {
            console.error(err);
        })
    })

export default router;