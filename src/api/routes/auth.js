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
        if (typeof req.headers.authorization != "string") {
            res.status(401).json({
                error: {
                    code: "No token",
                    message: "You need a Authorization header with 'Basic' authorization",
                }
            })
            return;
        }
        let { username, password } = basicToCredentials(req.headers.authorization);
        getToken(username, password).then(token => {
            res.status(200).json({ token });
        }).catch(err => {
            res.status(400).send("Wrong credentials or failed to connect to auth service");
        });
    })

export default router;