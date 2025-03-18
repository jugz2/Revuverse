import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  PaperAirplaneIcon, 
  EnvelopeIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import api from '../../api/api';

const ReviewRequestPage = () => {
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch businesses
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery(
    'businesses',
    async () => {
      const response = await api.get('/business');
      return response.data.data;
    }
  );
  
  // Set first business as selected when data loads
  useEffect(() => {
    if (businesses && businesses.length > 0 && !selectedBusiness) {
      setSelectedBusiness(businesses[0]._id);
    }
  }, [businesses, selectedBusiness]);
  
  // Fetch review requests
  const { data: reviewRequests, isLoading: isLoadingRequests } = useQuery(
    ['reviewRequests', selectedBusiness],
    async () => {
      if (!selectedBusiness) return [];
      const response = await api.get(`/review-request/business/${selectedBusiness}`);
      return response.data.data;
    },
    {
      enabled: !!selectedBusiness,
    }
  );
  
  // Create review request mutation
  const createReviewRequest = useMutation(
    async (data) => {
      return api.post('/review-request', data);
    },
    {
      onSuccess: () => {
        toast.success('Review request created successfully!');
        formik.resetForm();
        queryClient.invalidateQueries(['reviewRequests', selectedBusiness]);
      },
      onError: (error) => {
        console.error('Error creating review request:', error);
        toast.error(error.response?.data?.message || 'Failed to create review request');
      },
    }
  );
  
  // Send email mutation
  const sendEmail = useMutation(
    async (requestId) => {
      return api.post(`/review-request/${requestId}/send-email`);
    },
    {
      onSuccess: () => {
        toast.success('Email sent successfully!');
        queryClient.invalidateQueries(['reviewRequests', selectedBusiness]);
      },
      onError: (error) => {
        console.error('Error sending email:', error);
        toast.error(error.response?.data?.message || 'Failed to send email');
      },
    }
  );
  
  // Send SMS mutation
  const sendSMS = useMutation(
    async (requestId) => {
      return api.post(`/review-request/${requestId}/send-sms`);
    },
    {
      onSuccess: () => {
        toast.success('SMS sent successfully!');
        queryClient.invalidateQueries(['reviewRequests', selectedBusiness]);
      },
      onError: (error) => {
        console.error('Error sending SMS:', error);
        toast.error(error.response?.data?.message || 'Failed to send SMS');
      },
    }
  );
  
  // Delete review request mutation
  const deleteReviewRequest = useMutation(
    async (requestId) => {
      return api.delete(`/review-request/${requestId}`);
    },
    {
      onSuccess: () => {
        toast.success('Review request deleted successfully!');
        queryClient.invalidateQueries(['reviewRequests', selectedBusiness]);
      },
      onError: (error) => {
        console.error('Error deleting review request:', error);
        toast.error(error.response?.data?.message || 'Failed to delete review request');
      },
    }
  );
  
  // Form validation
  const formik = useFormik({
    initialValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      message: '',
    },
    validationSchema: Yup.object({
      customerName: Yup.string().required('Customer name is required'),
      customerEmail: Yup.string().email('Invalid email address').required('Email is required'),
      customerPhone: Yup.string().matches(/^\+?[1-9]\d{9,14}$/, 'Phone number is not valid'),
      message: Yup.string(),
    }),
    onSubmit: (values) => {
      if (!selectedBusiness) {
        toast.error('Please select a business');
        return;
      }
      
      createReviewRequest.mutate({
        ...values,
        business: selectedBusiness,
      });
    },
  });
  
  // Handle send email
  const handleSendEmail = (requestId) => {
    sendEmail.mutate(requestId);
  };
  
  // Handle send SMS
  const handleSendSMS = (requestId) => {
    sendSMS.mutate(requestId);
  };
  
  // Handle delete request
  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this review request?')) {
      deleteReviewRequest.mutate(requestId);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };
  
  if (isLoadingBusinesses) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (businesses && businesses.length === 0) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Review Requests</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">No Businesses Found</h2>
              <p className="mt-1 text-sm text-gray-500">
                You need to add a business before you can send review requests.
              </p>
              <div className="mt-6">
                <a
                  href="/businesses/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Business
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Review Requests</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Business selector */}
          <div className="mb-6">
            <label htmlFor="business-select" className="block text-sm font-medium text-gray-700">
              Select Business
            </label>
            <select
              id="business-select"
              name="business-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
            >
              {businesses.map((business) => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Create new request form */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Send New Review Request</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="customerName"
                      id="customerName"
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formik.touched.customerName && formik.errors.customerName ? 'border-red-300' : ''
                      }`}
                      value={formik.values.customerName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.customerName && formik.errors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.customerName}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                    Customer Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="customerEmail"
                      id="customerEmail"
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formik.touched.customerEmail && formik.errors.customerEmail ? 'border-red-300' : ''
                      }`}
                      value={formik.values.customerEmail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.customerEmail && formik.errors.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.customerEmail}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                    Customer Phone (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="customerPhone"
                      id="customerPhone"
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formik.touched.customerPhone && formik.errors.customerPhone ? 'border-red-300' : ''
                      }`}
                      placeholder="+1234567890"
                      value={formik.values.customerPhone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.customerPhone && formik.errors.customerPhone && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.customerPhone}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Custom Message (optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Add a personal message to your review request..."
                      value={formik.values.message}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={createReviewRequest.isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="mr-2 h-4 w-4" />
                  {createReviewRequest.isLoading ? 'Creating...' : 'Create Review Request'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Review requests list */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Review Requests</h3>
            </div>
            
            {isLoadingRequests ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : reviewRequests && reviewRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviewRequests.map((request) => (
                      <tr key={request._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{request.customerEmail}</div>
                          {request.customerPhone && (
                            <div className="text-sm text-gray-500">{request.customerPhone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(request.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleSendEmail(request._id)}
                            disabled={sendEmail.isLoading}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                            title="Send Email"
                          >
                            <EnvelopeIcon className="h-5 w-5" />
                          </button>
                          {request.customerPhone && (
                            <button
                              onClick={() => handleSendSMS(request._id)}
                              disabled={sendSMS.isLoading}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                              title="Send SMS"
                            >
                              <DevicePhoneMobileIcon className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(request._id)}
                            disabled={deleteReviewRequest.isLoading}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-sm text-gray-500">No review requests found for this business.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewRequestPage; 