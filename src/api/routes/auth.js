import { Router } from 'express';
import { getToken } from '../middleware';
import { basicToCredentials } from '../../utils';

let router = new Router();

router
    /*
        Accepts a request with a "Basic" Authorization header using the sharepoint email/username and password.
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme
    */
    .get('/', (req, res) => {
        let { username, password } = basicToCredentials(req.headers.authorization);
        getToken(username, password).then(token => {
            res.status(200).json({ token });
        }).catch(err => {
            res.status(err.status || 400).json({ errors: [err] });
        });
    })

export default router;