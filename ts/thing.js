"use strict";
exports.__esModule = true;
var url = require("url");
var _ = require("lodash");
var axios_1 = require("axios");
var MSOnlineSts = 'https://login.microsoftonline.com/extSTS.srf';
var FormsPath = '_forms/default.aspx?wa=wsignin1.0';
var online_saml_wsfed = "<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">\n<s:Header>\n  <a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>\n  <a:ReplyTo>\n\t<a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>\n  </a:ReplyTo>\n  <a:To s:mustUnderstand=\"1\">https://login.microsoftonline.com/extSTS.srf</a:To>\n  <o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n\t<o:UsernameToken>\n\t  <o:Username><%= username %></o:Username>\n\t  <o:Password><%= password %></o:Password>\n\t</o:UsernameToken>\n  </o:Security>\n</s:Header>\n<s:Body>\n  <t:RequestSecurityToken xmlns:t=\"http://schemas.xmlsoap.org/ws/2005/02/trust\">\n\t<wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\">\n\t  <a:EndpointReference>\n\t\t<a:Address><%= endpoint %></a:Address>\n\t  </a:EndpointReference>\n\t</wsp:AppliesTo>\n\t<t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>\n\t<t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>\n\t<t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType>\n  </t:RequestSecurityToken>\n</s:Body>\n</s:Envelope>";
function getSecurityTokenWithOnline() {
    var parsedUrl = url.parse('https://abb.sharepoint.com/sites/CombiX/LabInventory');
    var host = parsedUrl.host;
    var spFormsEndPoint = parsedUrl.protocol + "//" + host + "/" + FormsPath;
    var samlBody = _.template(online_saml_wsfed)({
        username: 'emil.ahlback@abbindustrigymnasium.se',
        password: '1Bemi1Babian1',
        endpoint: spFormsEndPoint
    });
    axios_1["default"].post(MSOnlineSts, {
        body: samlBody,
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/soap+xml; charset=utf-8'
        }
    }).then(function (xmlResponse) {
        console.log(xmlResponse);
    })["catch"](function (err) {
        console.log(err);
    });
}
getSecurityTokenWithOnline();
