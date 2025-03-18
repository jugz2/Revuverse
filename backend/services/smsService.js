const twilioClient = require('../config/twilio');

class SMSService {
    /**
     * Send an SMS message
     * @param {string} to - The recipient's phone number
     * @param {string} message - The message to send
     * @returns {Promise<Object>} - The Twilio message object
     */
    static async sendSMS(to, message) {
        try {
            // Check if we're in development and log more details
            if (process.env.NODE_ENV === 'development') {
                console.log('Attempting to send SMS:');
                console.log('To:', to);
                console.log('From:', process.env.TWILIO_PHONE_NUMBER);
                console.log('Message:', message);
            }
            
            const result = await twilioClient.messages.create({
                body: message,
                to: to,
                from: process.env.TWILIO_PHONE_NUMBER
            });
            
            if (process.env.NODE_ENV === 'development') {
                console.log('SMS sent successfully:', result.sid);
            }
            
            return result;
        } catch (error) {
            console.error('Error sending SMS:', {
                message: error.message,
                code: error.code,
                status: error.status
            });
            
            // Handle trial account errors specifically
            if (error.code === 21608) {
                throw new Error('Trial account limitation: You can only send SMS to verified phone numbers. Please verify the recipient number in the Twilio console.');
            }
            
            throw new Error(`Failed to send SMS message: ${error.message}`);
        }
    }

    /**
     * Send a verification code via SMS
     * @param {string} phoneNumber - The recipient's phone number
     * @returns {Promise<Object>} - The verification result
     */
    static async sendVerificationCode(phoneNumber) {
        try {
            console.log('Attempting to send verification code to:', phoneNumber);
            console.log('Using Verify Service SID:', process.env.TWILIO_VERIFY_SERVICE_SID);
            
            if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
                throw new Error('TWILIO_VERIFY_SERVICE_SID is not configured in environment variables');
            }

            const verification = await twilioClient.verify.v2
                .services(process.env.TWILIO_VERIFY_SERVICE_SID)
                .verifications.create({
                    to: phoneNumber,
                    channel: 'sms'
                });
            
            console.log('Verification sent successfully:', verification);
            return verification;
        } catch (error) {
            console.error('Detailed error in sendVerificationCode:', {
                message: error.message,
                code: error.code,
                status: error.status,
                moreInfo: error.moreInfo,
                details: error.details
            });
            
            // Handle trial account errors
            if (error.code === 60200) {
                throw new Error('Trial account limitation: Invalid phone number format or number not verified. For trial accounts, you must verify the recipient phone number in the Twilio console.');
            }
            
            throw new Error(`Failed to send verification code: ${error.message}`);
        }
    }

    /**
     * Verify a code sent via SMS
     * @param {string} phoneNumber - The recipient's phone number
     * @param {string} code - The verification code
     * @returns {Promise<Object>} - The verification check result
     */
    static async verifyCode(phoneNumber, code) {
        try {
            const verificationCheck = await twilioClient.verify.v2
                .services(process.env.TWILIO_VERIFY_SERVICE_SID)
                .verificationChecks.create({
                    to: phoneNumber,
                    code: code
                });
            return verificationCheck;
        } catch (error) {
            console.error('Error verifying code:', {
                message: error.message,
                code: error.code,
                status: error.status
            });
            throw new Error(`Failed to verify code: ${error.message}`);
        }
    }
    
    /**
     * Send a review request SMS
     * @param {Object} options - Options for sending the review request
     * @param {string} options.to - The recipient's phone number
     * @param {string} options.businessName - The name of the business
     * @param {string} options.feedbackUrl - The URL for leaving feedback
     * @returns {Promise<Object>} - The Twilio message object
     */
    static async sendReviewRequestSMS(options) {
        const { to, businessName, feedbackUrl } = options;
        
        const message = `${businessName} would like your feedback! Please take a moment to share your experience: ${feedbackUrl}`;
        
        return this.sendSMS(to, message);
    }
    
    /**
     * Send a review reminder SMS
     * @param {Object} options - Options for sending the review reminder
     * @param {string} options.to - The recipient's phone number
     * @param {string} options.businessName - The name of the business
     * @param {string} options.feedbackUrl - The URL for leaving feedback
     * @returns {Promise<Object>} - The Twilio message object
     */
    static async sendReviewReminderSMS(options) {
        const { to, businessName, feedbackUrl } = options;
        
        const message = `Reminder: ${businessName} would appreciate your feedback! It only takes a minute: ${feedbackUrl}`;
        
        return this.sendSMS(to, message);
    }
}

module.exports = SMSService; 