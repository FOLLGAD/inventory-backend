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

// Implementation of the btoa() function in js
export function btoa(str) {
    return Buffer(str, 'binary').toString('base64');
}

// Implementation of the atob() function in js
export function atob(str) {
    return new Buffer(str, 'base64').toString('binary')
}

// Acceptable ObjectTypes with names
export const ObjectTypes = {
	'Number': Number,
	'String': String,
	'Date': Date,
	'Boolean': Boolean,
}