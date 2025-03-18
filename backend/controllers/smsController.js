const SMSService = require('../services/smsService');
const twilioClient = require('../config/twilio');

/**
 * Send an SMS message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendSMS = async (req, res) => {
    try {
        const { to, message } = req.body;
        
        if (!to || !message) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and message are required'
            });
        }

        const result = await SMSService.sendSMS(to, message);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Send a verification code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendVerificationCode = async (req, res) => {
    try {
        console.log('[DEBUG] Entering sendVerificationCode');
        console.log('[DEBUG] Request body:', req.body);
        
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
            console.log('[DEBUG] Phone number missing');
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        console.log('[DEBUG] Attempting to send verification code to:', phoneNumber);
        console.log('[DEBUG] Twilio config:', {
            accountSid: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not set',
            authToken: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not set',
            verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID ? 'Set' : 'Not set'
        });

        const result = await SMSService.sendVerificationCode(phoneNumber);
        console.log('[DEBUG] Verification code sent successfully:', result);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[DEBUG] Error in sendVerificationCode:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        
        res.status(500).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                details: error
            } : undefined
        });
    }
};

/**
 * Verify a code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.verifyCode = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        
        if (!phoneNumber || !code) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and verification code are required'
            });
        }

        const result = await SMSService.verifyCode(phoneNumber, code);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Test Twilio configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.testTwilioConfig = async (req, res) => {
    try {
        console.log('Testing Twilio configuration...');
        console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
        console.log('Verify Service SID:', process.env.TWILIO_VERIFY_SERVICE_SID);
        
        // Try to fetch account details to verify credentials
        const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        
        res.status(200).json({
            success: true,
            message: 'Twilio configuration is valid',
            accountName: account.friendlyName,
            accountStatus: account.status
        });
    } catch (error) {
        console.error('Twilio Configuration Test Error:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({
            success: false,
            message: 'Twilio configuration test failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Configuration error'
        });
    }
}; 