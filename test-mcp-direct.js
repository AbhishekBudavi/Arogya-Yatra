const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
  process.exit(1);
});

console.log('Testing http://127.0.0.1:3001/health');
req.end();
