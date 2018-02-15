import * as spauth from 'node-sp-auth';
import jwt from 'jsonwebtoken';

import { User } from './models';
import { sharepointUrl, tokenSecret } from '../consts';

/*
    Checks the validity of the token in the "token" header, and sets the req.user property to the users' database entry.
*/
export function verifyToken(req, res, next) {
    if (!req.headers.token) {
        res.status(401).send('TOKEN REQUIRED');
        return;
    }

    try {
        let email = jwt.verify(req.headers.token, tokenSecret);

        User
            .findOneAndUpdate({ email: email }, { lastActive: new Date() }, { upsert: true }, (err, user) => {
                if (user && !err) {
                    req.user = user; // Set the req.user to the user object for easy access in the rest of the API
                    next();
                } else {
                    throw new Error('USER NOT FOUND');
                }
            })
    } catch (err) {
        res.status(400).send('BAD TOKEN');
    }
}

/*
    Takes username and password and returns a JWT token to be sent in the "token" header in subsequent requests.
*/
export function getToken(username, password) {
    return new Promise((res, rej) => {
        if (typeof username != 'string' || typeof password != 'string') {
            rej('Username and password needed');
            return;
        }
        // spauth.getAuth() returns a cookie, which can then be used to auth further Sharepoint-requests.
        spauth.getAuth(sharepointUrl, {
            username,
            password,
        }).then(options => {
            // Auth successful
            User
                .findOne({ email: username })
                .exec()
                .then(user => {
                    if (user) {
                        // If user already exists in database, just resolve the token without further actions
                        res(jwt.sign(username, tokenSecret));
                    } else {
                        // If user exists in database, register the email.
                        User
                            .create({ email: username, lastActive: new Date() })
                            .then(te => {
                                res(jwt.sign(username, tokenSecret));
                            });
                    }
                });

        }).catch(err => {
            // Auth failed
            rej(err);
        })
    })
}