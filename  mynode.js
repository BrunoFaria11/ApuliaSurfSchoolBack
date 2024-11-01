const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const dotenv = require('dotenv').config({path: 'src/.env'}); ;

const envFile = `export const environment = {
    production: '${process.env.production}',
    cm: '${process.env.cm}',
    appUrl: '${process.env.appUrl}',
    domain: '${process.env.domain}',
    clientId: '${process.env.clientId}',
    redirect_uri: '${process.env.redirect_uri}',
    audience: '${process.env.audience}',
    scope: '${process.env.scope}',

};
`;

const targetPath = path.join(__dirname, './src/environments/environment.ts');
fs.writeFile(targetPath, envFile, (err) => {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.log(successColor, `${checkSign} Successfully generated environment.ts`);
    }
});