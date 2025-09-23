// Quick test script to check Parse registration
const testData = {
  username: "antony.we@test.com",
  email: "antony.we@test.com",
  password: "TestPass123!",
  firstName: "Antony",
  lastName: "We",
  role: "student"
};

const headers = {
  'X-Parse-Application-Id': 'elimu-smart-local-dev',
  'X-Parse-Javascript-Key': 'elimu-smart-js-key-dev',
  'Content-Type': 'application/json'
};

fetch('http://localhost:1337/parse/users', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});