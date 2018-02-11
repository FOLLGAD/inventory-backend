'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.btoa = btoa;
exports.atob = atob;
function btoa(str) {
    return Buffer(str, 'binary').toString('base64');
}

function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}