const fs = require('fs');


const targetPathProd = './src/environments/environment.prod.ts';
const targetPathDev = './src/environments/environment.ts'; 


const backendUrl = process.env.URL_BACKEND || 'http://localhost:8080/api/v1';


const envConfigFileProd = `
export const environment = {
  production: true,
  apiUrl: '${backendUrl}'
};
`;


const envConfigFileDev = `
export const environment = {
  production: false, 
  apiUrl: '${backendUrl}'
};
`;


fs.writeFileSync(targetPathProd, envConfigFileProd);
fs.writeFileSync(targetPathDev, envConfigFileDev);

console.log(`✅ environment.prod.ts y environment.ts generados con apiUrl=${backendUrl}`);