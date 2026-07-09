const https = require('https');

console.log("Checking categories endpoint...");
https.get('https://api.techbes.co.in/api/v2/catalog/categories', (res) => {
  console.log('Categories Status code:', res.statusCode);
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log('Categories response snippet:', body.slice(0, 200));
  });
}).on('error', (e) => {
  console.error('Categories Error:', e.message);
});

console.log("Checking health endpoint...");
https.get('https://api.techbes.co.in/health', (res) => {
  console.log('Health Status code:', res.statusCode);
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log('Health response:', body);
  });
}).on('error', (e) => {
  console.error('Health Error:', e.message);
});
