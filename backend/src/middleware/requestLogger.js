// Middleware to log API request and response details
const requestLogger = (req, res, next) => {
  // Store original send method
  const originalSend = res.send;
  
  // Get timestamp when request started
  const startTime = new Date();
  
  // Log request details
  console.log('\n----- API REQUEST -----');
  console.log(`Time: ${startTime.toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`IP: ${req.ip}`);
  console.log(`User Agent: ${req.get('user-agent')}`);
  
  // Log request body if it exists and isn't empty
  if (req.body && Object.keys(req.body).length > 0) {
    // Sanitize sensitive data
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.creditCard) sanitizedBody.creditCard = '[REDACTED]';
    
    console.log('Request Body:', JSON.stringify(sanitizedBody, null, 2));
  }
  
  // Override send method to log response
  res.send = function (body) {
    // Calculate response time
    const endTime = new Date();
    const responseTime = endTime - startTime;
    
    // Log response details
    console.log('\n----- API RESPONSE -----');
    console.log(`Time: ${endTime.toISOString()}`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response Time: ${responseTime}ms`);
    
    // Log response body if it exists
    try {
      // For JSON responses
      if (typeof body === 'string' && body.startsWith('{')) {
        const parsedBody = JSON.parse(body);
        // Sanitize sensitive data
        const sanitizedResponse = { ...parsedBody };
        if (sanitizedResponse.token) sanitizedResponse.token = '[REDACTED]';
        
        console.log('Response Body:', JSON.stringify(sanitizedResponse, null, 2));
      } else if (body) {
        // For non-JSON responses, just log the type
        console.log('Response Body: [Non-JSON response]');
      }
    } catch (error) {
      console.log('Response Body: [Unable to parse]');
    }
    
    console.log('----- END -----\n');
    
    // Call original send method
    originalSend.call(this, body);
    return this;
  };
  
  next();
};

module.exports = requestLogger; 