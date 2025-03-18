const sgMail = require('@sendgrid/mail');

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send a review request email to a customer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.customerName - Customer name
 * @param {string} options.businessName - Business name
 * @param {string} options.feedbackUrl - URL for the feedback form
 * @returns {Promise} - SendGrid response
 */
exports.sendReviewRequest = async (options) => {
  const message = {
    to: options.to,
    from: {
      email: 'noreply@revuverse.com',
      name: 'Revuverse'
    },
    subject: `${options.businessName} would like your feedback`,
    templateId: 'd-xxxxxxxxxxxx', // Replace with your SendGrid template ID
    dynamicTemplateData: {
      customerName: options.customerName,
      businessName: options.businessName,
      feedbackUrl: options.feedbackUrl
    }
  };

  try {
    return await sgMail.send(message);
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error('Error Response Body:', error.response.body);
    }
    throw error;
  }
};

/**
 * Send a reminder email for a review request
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.customerName - Customer name
 * @param {string} options.businessName - Business name
 * @param {string} options.feedbackUrl - URL for the feedback form
 * @returns {Promise} - SendGrid response
 */
exports.sendReviewReminder = async (options) => {
  const message = {
    to: options.to,
    from: {
      email: 'noreply@revuverse.com',
      name: 'Revuverse'
    },
    subject: `Reminder: ${options.businessName} would appreciate your feedback`,
    templateId: 'd-xxxxxxxxxxxx', // Replace with your SendGrid template ID
    dynamicTemplateData: {
      customerName: options.customerName,
      businessName: options.businessName,
      feedbackUrl: options.feedbackUrl
    }
  };

  try {
    return await sgMail.send(message);
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error('Error Response Body:', error.response.body);
    }
    throw error;
  }
};

/**
 * Send a notification to the business owner about new feedback
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email (business owner)
 * @param {string} options.businessName - Business name
 * @param {string} options.customerName - Customer name
 * @param {number} options.rating - Customer rating (1-5)
 * @param {string} options.comment - Customer comment
 * @param {string} options.dashboardUrl - URL to the dashboard
 * @returns {Promise} - SendGrid response
 */
exports.sendFeedbackNotification = async (options) => {
  const message = {
    to: options.to,
    from: {
      email: 'noreply@revuverse.com',
      name: 'Revuverse'
    },
    subject: `New Feedback for ${options.businessName}`,
    templateId: 'd-xxxxxxxxxxxx', // Replace with your SendGrid template ID
    dynamicTemplateData: {
      businessName: options.businessName,
      customerName: options.customerName,
      rating: options.rating,
      comment: options.comment,
      dashboardUrl: options.dashboardUrl
    }
  };

  try {
    return await sgMail.send(message);
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error('Error Response Body:', error.response.body);
    }
    throw error;
  }
}; 