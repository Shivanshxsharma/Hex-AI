const https = require('https');

function checkAPIKey() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=`;
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => 
      data += chunk;
    });
    
    res.on('end', () => {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        console.log('❌ Error:', parsed.error.message);
      } else {
        console.log('✅ API Key is valid!');
        console.log('Available models:', parsed.models.length);
      }
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
}

checkAPIKey();
