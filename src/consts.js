require('dotenv').config()

export const sharepointUrl = process.env.SHAREPOINT_URL || 'https://abb.sharepoint.com/sites/CombiX/LabInventory';

export const tokenSecret = process.env.TOKEN_SECRET;