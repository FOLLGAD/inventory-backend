import * as spauth from 'node-sp-auth';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const { sharepointUrl, tokenSecret } = require('../../config.json');

// function make_base_auth(user, password) {
//     var tok = user + ':' + password;
//     var hash = Base64.encode(tok);
//     return "Basic " + hash;
// }

function btoa(str) {
    return Buffer(str, 'binary').toString('base64');
}
function atob(str) {
    return new Buffer(str, 'base64').toString('binary')
}

export function basicToCredentials(basicAuthString) {
    let base64String = basicAuthString.replace('Basic ', '');
    let decoded = atob(base64String);
    let [username, password] = decoded.split(':');
    return { username, password };
}

export function verifyToken(req, res, next) {
    try {
        let user = jwt.verify(req.header.token, tokenSecret);
        req.user = user;
        return user;
    } catch (err) {
        return err;
    }
}

export function getToken(username, password) {
    return new Promise((res, rej) => {
        if (typeof username != 'string' || typeof password != 'string')
            rej('Username and password needed');

        spauth.getAuth('https://abb.sharepoint.com/sites/CombiX/LabInventory/', {
            username,
            password,
        }).then(options => {
            let headers = options.headers;
            headers['Accept'] = 'application/json;odata=verbose';

            axios(sharepointUrl + '/_api/web', {
                headers,
            }).then(response => {
                response.status == 200 ? res(jwt.sign(username, tokenSecret)) : rej(response.status);
            });
        })
    })
}