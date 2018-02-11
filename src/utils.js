export function btoa(str) {
    return Buffer(str, 'binary').toString('base64');
}

export function atob(str) {
    return new Buffer(str, 'base64').toString('binary')
}