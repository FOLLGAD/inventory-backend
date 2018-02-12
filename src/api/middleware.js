import * as spauth from 'node-sp-auth';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import { atob } from '../utils';

const { sharepointUrl, tokenSecret } = require('../../config.json');

// function make_base_auth(user, password) {
//     var tok = user + ':' + password;
//     var hash = Base64.encode(tok);
//     return 'Basic " + hash;
// }

export function basicToCredentials(basicAuthString) {
    let base64String = basicAuthString.replace('Basic ', '');
    let decoded = atob(base64String);
    let [username, password] = decoded.split(':');
    return { username, password };
}

export function verifyToken(req, res, next) {
    if (!req.headers.token) res.status(401).send('TOKEN REQUIRED');
    try {
        let user = jwt.verify(req.headers.token, tokenSecret);
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send('BAD TOKEN');
    }
}

export function getToken(username, password) {
    return new Promise((res, rej) => {
        if (typeof username != 'string' || typeof password != 'string')
            rej('Username and password needed');

        // spauth.getAuth() returns a cookie, which can then be used to auth further requests.
        spauth.getAuth(sharepointUrl, {
            username,
            password,
        }).then(options => {
            // Auth successful

            // let headers = options.headers;
            // headers['Accept'] = 'application/json;odata=verbose';

            // let url = apiUrl + '_api/SP.UserProfiles.PeopleManager/GetMyProperties';

            // axios.get(url, {
            //     headers,
            // }).then(response => {
            //     console.log(response);
            // })

            db.collection('users')
                .findOne({ email: username })
                .then(user => {
                    if (user) {
                        res(jwt.sign(username, tokenSecret));
                    } else {
                        db.collection('users')
                            .insertOne({ email: username, lastActive: new Date(), registered: new Date(), cookie: options.headers.Cookie })
                            .then(te => {
                                res(jwt.sign(username, tokenSecret));
                            });
                    }
                });

        }).catch(err => {
            // Auth failed
            console.log(err)

            rej(err);
        })
    })
}