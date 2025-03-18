const twilio = require('twilio');

// Mock client for development when real credentials are unavailable
const mockTwilioClient = {
    messages: {
        create: async (options) => {
            console.log('MOCK SMS: Would send SMS', options);
            return { 
                sid: 'MOCK_SID', 
                status: 'sent',
                to: options.to,
                body: options.body
            };
        }
    },
    verify: {
        v2: {
            services: (serviceSid) => ({
                verifications: {
                    create: async (options) => {
                        console.log('MOCK VERIFY: Would send verification code to', options.to);
                        return { 
                            sid: 'MOCK_VERIFICATION_SID', 
                            status: 'pending',
                            to: options.to
                        };
                    }
                },
                verificationChecks: {
                    create: async (options) => {
                        console.log('MOCK VERIFY: Would verify code', options.code, 'for', options.to);
                        // Always successful for mock
                        return { 
                            sid: 'MOCK_VERIFICATION_CHECK_SID', 
                            status: 'approved',
                            to: options.to
                        };
                    }
                }
            })
        }
    },
    api: {
        accounts: (accountSid) => ({
            fetch: async () => ({
                friendlyName: 'Mock Twilio Account',
                status: 'active',
                type: 'Trial'
            })
        })
    }
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let client;

try {
    // Check if credentials are provided
    if (!accountSid || !authToken) {
        console.warn('WARNING: Twilio credentials not configured in environment variables');
        
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            console.warn('Running in development/test mode - using mock Twilio client');
            client = mockTwilioClient;
        } else {
            throw new Error('Twilio credentials are required in production');
        }
    } else {
        // Create real client with provided credentials
        client = twilio(accountSid, authToken);
        console.log('Twilio client initialized with provided credentials');
    }
} catch (error) {
    console.error('Error initializing Twilio client:', error.message);
    
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.warn('Running in development/test mode - using mock Twilio client instead');
        client = mockTwilioClient;
    } else {
        throw error; // Re-throw in production
    }
}

module.exports = client; 