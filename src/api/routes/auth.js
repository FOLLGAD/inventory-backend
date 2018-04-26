import { Router } from 'express';
import { getToken } from '../middleware';
import { basicToCredentials } from '../../utils';
import { User } from '../models';

import * as spauth from 'node-sp-auth';

let router = new Router();

router
    /*
        Accepts a request with a "Basic" Authorization header using the sharepoint email/username and password.
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme
    */
    .get('/', (req, res) => {
        if (typeof req.headers.authorization != "string") {
            res.status(400).json({
                error: {
                    code: "No token",
                    message: "You need a Authorization header with 'Basic' authorization",
                }
            })
            return;
        }
        let { username, password } = basicToCredentials(req.headers.authorization);
        getToken(username, password).then(token => {
            User.findOne({ email: username }).exec()
                .then(d => {
                    if (d._doc) {
                        res.status(200).json(Object.assign({}, d._doc, { token }));
                    } else {
                        User.create({ email: username });
                        res.status(200).json({ token });
                    }
                })
        }).catch(err => {
            res.status(401).send("Wrong credentials or failed to connect to auth service");
        });
    })
    .get('/test', (req, res) => {
        let { username, password } = basicToCredentials(req.headers.authorization);

        // authurl: https://abb.sharepoint.com/
        // basic auth

        spauth.getAuth(req.headers.authurl, {
            username,
            password,
        })
        .then(resp => {
            console.log(resp)
            res.sendStatus(200)
        })
        .catch(resp => {
            console.log(resp)
            res.sendStatus(400)
        })
    })

export default router;