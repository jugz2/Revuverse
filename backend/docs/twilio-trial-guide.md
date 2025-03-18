# Twilio Trial Account Guide for Revuverse

This guide provides important information for working with a Twilio trial account in the Revuverse application.

## Trial Account Limitations

When using a Twilio trial account, there are several limitations to be aware of:

1. **Phone Number Verification Required**

   - You can only send SMS messages to phone numbers that have been verified in your Twilio account
   - You can only make calls to verified phone numbers
   - Verification codes can only be sent to verified phone numbers

2. **Limited Features**

   - Trial accounts have a limited balance (typically $15-20)
   - Some advanced features may be restricted
   - The word "Trial" is prepended to all SMS messages

3. **Message Restrictions**
   - Messages will contain a trial account notice
   - Some message templates may be restricted

## Setting Up Your Twilio Trial Account

1. **Verify Your Personal Phone Number**

   - Log in to your [Twilio Console](https://www.twilio.com/console)
   - Navigate to "Verified Caller IDs" under "Phone Numbers"
   - Click "Add a New Caller ID" and follow the verification process

2. **Add Additional Verified Numbers**

   - You can add additional phone numbers to test with
   - Each number must go through the verification process

3. **Update Environment Variables**
   - Make sure your `.env` file contains the correct Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
   ```

## Testing SMS with Trial Account

### Testing from the Command Line

Use our test script to verify your Twilio setup:

```bash
node test-twilio.js
```

### Testing in the Application

When testing in the application:

1. Use only verified phone numbers for recipients
2. Check the server logs for detailed error messages
3. Remember that all messages will have "Sent from your Twilio trial account" prepended

## Troubleshooting

### Common Errors

| Error Code | Description                      | Solution                                       |
| ---------- | -------------------------------- | ---------------------------------------------- |
| 21608      | Cannot send to unverified number | Verify the recipient number in Twilio console  |
| 60200      | Invalid phone number format      | Check phone number format or verify the number |
| 20003      | Authentication error             | Check your ACCOUNT_SID and AUTH_TOKEN          |

### Verification Process Issues

If you're having trouble with verification:

1. Make sure the phone number is in E.164 format (e.g., +1XXXXXXXXXX)
2. Check that the verification service SID is correct
3. Try using a different verification channel (call instead of SMS)

## Moving to Production

When you're ready to move beyond trial limitations:

1. Upgrade your Twilio account
2. Purchase a phone number for production use
3. Update your environment variables
4. Remove any trial-specific workarounds from your code

## Additional Resources

- [Twilio Trial Account Documentation](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account)
- [Twilio SMS API Documentation](https://www.twilio.com/docs/sms)
- [Twilio Verify API Documentation](https://www.twilio.com/docs/verify/api)
