import * as url from 'url';
import * as util from 'util';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as cookie from 'cookie';
import * as path from 'path';

import axios from 'axios';

const MSOnlineSts = 'https://login.microsoftonline.com/extSTS.srf';
const FormsPath = '_forms/default.aspx?wa=wsignin1.0';

const online_saml_wsfed = `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
<s:Header>
  <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>
  <a:ReplyTo>
	<a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>
  </a:ReplyTo>
  <a:To s:mustUnderstand="1">https://login.microsoftonline.com/extSTS.srf</a:To>
  <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
	<o:UsernameToken>
	  <o:Username><%= username %></o:Username>
	  <o:Password><%= password %></o:Password>
	</o:UsernameToken>
  </o:Security>
</s:Header>
<s:Body>
  <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust">
	<wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
	  <a:EndpointReference>
		<a:Address><%= endpoint %></a:Address>
	  </a:EndpointReference>
	</wsp:AppliesTo>
	<t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>
	<t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>
	<t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType>
  </t:RequestSecurityToken>
</s:Body>
</s:Envelope>`

function getSecurityTokenWithOnline() {
	let parsedUrl: url.Url = url.parse('https://abb.sharepoint.com/sites/CombiX/LabInventory');
	let host: string = parsedUrl.host;
	let spFormsEndPoint = `${parsedUrl.protocol}//${host}/${FormsPath}`;

	let samlBody: string = _.template(
		online_saml_wsfed)({
			username: 'emil.ahlback@abbindustrigymnasium.se',
			password: '1Bemi1Babian1',
			endpoint: spFormsEndPoint
		});

	axios.post(MSOnlineSts, {
		body: samlBody,
		mode: 'no-cors',
		headers: {
			'Content-Type': 'application/soap+xml; charset=utf-8'
		}
	}).then(xmlResponse => {
		console.log(xmlResponse);
	}).catch(err => {
		console.log(err);
	})
}

getSecurityTokenWithOnline();