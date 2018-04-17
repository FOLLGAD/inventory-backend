'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var sharepointUrl = exports.sharepointUrl = process.env.SHAREPOINT_URL || 'https://abb.sharepoint.com/sites/CombiX/LabInventory';

var tokenSecret = exports.tokenSecret = process.env.TOKEN_SECRET;