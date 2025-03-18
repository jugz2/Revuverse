import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  UserIcon, 
  KeyIcon, 
  BellIcon, 
  EnvelopeIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile settings
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: ''
  });
  
  // Password settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    reviewAlerts: true,
    feedbackAlerts: true,
    marketingEmails: false,
    smsNotifications: false
  });
  
  // Email templates
  const [emailTemplates, setEmailTemplates] = useState({
    reviewRequest: '',
    feedbackThankYou: '',
    reviewThankYou: ''
  });
  
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || ''
      });
      
      // Fetch notification settings
      fetchNotificationSettings();
      
      // Fetch email templates
      fetchEmailTemplates();
    }
  }, [user]);
  
  const fetchNotificationSettings = async () => {
    try {
      const response = await api.get('/api/settings/notifications');
      setNotificationSettings(response.data);
    } catch (err) {
      console.error('Error fetching notification settings:', err);
    }
  };
  
  const fetchEmailTemplates = async () => {
    try {
      const response = await api.get('/api/settings/email-templates');
      setEmailTemplates(response.data);
    } catch (err) {
      console.error('Error fetching email templates:', err);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleEmailTemplateChange = (e) => {
    const { name, value } = e.target;
    setEmailTemplates(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await api.put('/api/auth/profile', profileForm);
      updateUser(response.data);
      setSuccess('Profile updated successfully');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put('/api/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      setLoading(false);
    }
  };
  
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put('/api/settings/notifications', notificationSettings);
      setSuccess('Notification settings updated successfully');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update notification settings');
      setLoading(false);
    }
  };
  
  const handleEmailTemplateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put('/api/settings/email-templates', emailTemplates);
      setSuccess('Email templates updated successfully');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email templates');
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/api/auth/account');
        logout();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <XCircleIcon className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'password' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <KeyIcon className="h-5 w-5 mr-3" />
                Password
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BellIcon className="h-5 w-5 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('emailTemplates')}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'emailTemplates' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <EnvelopeIcon className="h-5 w-5 mr-3" />
                Email Templates
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'billing' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCardIcon className="h-5 w-5 mr-3" />
                Billing
              </button>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={profileForm.company}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Password Settings */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h2>
                <form onSubmit={handleNotificationSubmit}>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reviewAlerts"
                        name="reviewAlerts"
                        checked={notificationSettings.reviewAlerts}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="reviewAlerts" className="ml-2 block text-sm text-gray-700">
                        New Review Alerts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feedbackAlerts"
                        name="feedbackAlerts"
                        checked={notificationSettings.feedbackAlerts}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="feedbackAlerts" className="ml-2 block text-sm text-gray-700">
                        New Feedback Alerts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smsNotifications"
                        name="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                        SMS Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketingEmails"
                        name="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                        Marketing Emails
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Email Templates */}
            {activeTab === 'emailTemplates' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Templates</h2>
                <form onSubmit={handleEmailTemplateSubmit}>
                  <div className="space-y-6 mb-4">
                    <div>
                      <label htmlFor="reviewRequest" className="block text-sm font-medium text-gray-700 mb-1">
                        Review Request Email
                      </label>
                      <textarea
                        id="reviewRequest"
                        name="reviewRequest"
                        value={emailTemplates.reviewRequest}
                        onChange={handleEmailTemplateChange}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Template for requesting reviews from customers..."
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">
                        Available variables: {'{customerName}'}, {'{businessName}'}, {'{reviewLink}'}
                      </p>
                    </div>
                    <div>
                      <label htmlFor="feedbackThankYou" className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback Thank You Email
                      </label>
                      <textarea
                        id="feedbackThankYou"
                        name="feedbackThankYou"
                        value={emailTemplates.feedbackThankYou}
                        onChange={handleEmailTemplateChange}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Template for thanking customers for their feedback..."
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">
                        Available variables: {'{customerName}'}, {'{businessName}'}
                      </p>
                    </div>
                    <div>
                      <label htmlFor="reviewThankYou" className="block text-sm font-medium text-gray-700 mb-1">
                        Review Thank You Email
                      </label>
                      <textarea
                        id="reviewThankYou"
                        name="reviewThankYou"
                        value={emailTemplates.reviewThankYou}
                        onChange={handleEmailTemplateChange}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Template for thanking customers for their reviews..."
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">
                        Available variables: {'{customerName}'}, {'{businessName}'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Templates'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing & Subscription</h2>
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Current Plan: {user?.subscription?.plan || 'Free'}</h3>
                  {user?.subscription?.status === 'active' && (
                    <p className="text-blue-600">
                      Your subscription is active until {new Date(user.subscription.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                  {user?.subscription?.status === 'canceled' && (
                    <p className="text-yellow-600">
                      Your subscription has been canceled and will expire on {new Date(user.subscription.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                  {(!user?.subscription || user?.subscription?.status === 'expired') && (
                    <p className="text-gray-600">
                      You are currently on the free plan with limited features.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <a
                    href="/dashboard/subscription"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                  >
                    Manage Subscription
                  </a>
                  <a
                    href="/dashboard/subscription#billing-history"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
                  >
                    View Billing History
                  </a>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-800 mb-4">Payment Methods</h3>
                  <p className="text-gray-600 mb-4">
                    Manage your payment methods in the subscription page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 