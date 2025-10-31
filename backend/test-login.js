const http = require('http');

const data = JSON.stringify({
  username: 'amara.student@elimu.com',
  password: 'AmaraTest2024!'
});

const options = {
  hostname: 'localhost',
  port: 1337,
  path: '/parse/login',
  method: 'POST',
  headers: {
    'X-Parse-Application-Id': 'elimu_smart_app_2024',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', e => console.error('Error:', e));
req.write(data);
req.end();
