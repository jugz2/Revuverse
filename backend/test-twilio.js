require('dotenv').config();
const twilio = require('twilio');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to test the Twilio configuration
async function testTwilioConfig() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    console.log('Testing Twilio configuration...');
    console.log('Account SID:', accountSid);
    console.log('Auth Token is set:', authToken ? 'Yes' : 'No');
    console.log('Verify Service SID:', process.env.TWILIO_VERIFY_SERVICE_SID);
    console.log('Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);
    
    const client = twilio(accountSid, authToken);
    
    // Try to fetch account details to verify credentials
    console.log('Fetching account details...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log('Account Name:', account.friendlyName);
    console.log('Account Status:', account.status);
    console.log('Account Type:', account.type);
    
    // Output important info for trial accounts
    console.log('\nImportant Trial Account Information:');
    if (account.type === 'Trial') {
      console.log('- This is a trial account');
      console.log('- With trial accounts, you can only send SMS to verified phone numbers');
      console.log('- To add verified phone numbers, go to the Twilio console');
    }
    
    return {
      success: true,
      accountName: account.friendlyName,
      accountStatus: account.status,
      accountType: account.type
    };
  } catch (error) {
    console.error('Twilio Configuration Test Error:', {
      message: error.message,
      stack: error.stack
    });
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to test sending SMS with trial account
async function testSendSMS(toNumber) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    
    console.log('\nTesting SMS sending...');
    
    console.log(`Attempting to send SMS to ${toNumber}`);
    const message = await client.messages.create({
      body: 'This is a test SMS from your Revuverse application',
      to: toNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    console.log('SMS sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Message Status:', message.status);
    
    return {
      success: true,
      messageSid: message.sid,
      status: message.status
    };
  } catch (error) {
    console.error('SMS Test Error:', {
      message: error.message,
      code: error.code,
      moreInfo: error.moreInfo || 'No additional info'
    });
    
    if (error.code === 21608) {
      console.log('\nTrial Account Limitation:');
      console.log('- With trial accounts, you can only send SMS to verified phone numbers');
      console.log('- Please verify the recipient number in your Twilio console');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to get a verified phone number from user
function getVerifiedPhoneNumber() {
  return new Promise((resolve) => {
    rl.question('\nEnter a verified phone number to test with (in E.164 format, e.g. +1XXXXXXXXXX): ', (answer) => {
      resolve(answer.trim());
    });
  });
}

// Run the tests
async function runTests() {
  console.log('===== TWILIO CONFIGURATION TEST =====');
  const configResult = await testTwilioConfig();
  
  if (configResult.success) {
    if (configResult.accountType === 'Trial') {
      console.log('\nPlease note: You are using a trial account, which requires phone number verification.');
      const phoneNumber = await getVerifiedPhoneNumber();
      console.log('\n===== SMS SENDING TEST =====');
      await testSendSMS(phoneNumber);
    } else {
      console.log('\n===== SMS SENDING TEST =====');
      await testSendSMS(process.env.TWILIO_PHONE_NUMBER); // Use your Twilio number as a fallback
    }
  }
  
  console.log('\n===== TESTS COMPLETED =====');
  rl.close();
}

runTests(); 