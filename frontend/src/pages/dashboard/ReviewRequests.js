import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  PlusIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import api from '../../api/api';

const ReviewRequests = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialBusinessId = queryParams.get('businessId');

  const [reviewRequests, setReviewRequests] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(initialBusinessId || 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, sent, pending
  const [sortBy, setSortBy] = useState('date'); // date, name
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessId: initialBusinessId || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: ''
  });
  const [sendingRequest, setSendingRequest] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchReviewRequests();
  }, [selectedBusiness]);

  useEffect(() => {
    if (initialBusinessId) {
      setFormData(prev => ({ ...prev, businessId: initialBusinessId }));
    }
  }, [initialBusinessId]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/api/business');
      setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const fetchReviewRequests = async () => {
    try {
      setLoading(true);
      let url = '/api/review-request';
      if (selectedBusiness !== 'all') {
        url = `/api/review-request?businessId=${selectedBusiness}`;
      }
      const response = await api.get(url);
      setReviewRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load review requests. Please try again.');
      setLoading(false);
      console.error('Error fetching review requests:', err);
    }
  };

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequest = () => {
    setFormData({
      businessId: selectedBusiness !== 'all' ? selectedBusiness : '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      message: ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessId) {
      setError('Please select a business');
      return;
    }
    
    if (!formData.customerName || (!formData.customerEmail && !formData.customerPhone)) {
      setError('Please provide customer name and either email or phone');
      return;
    }
    
    try {
      setSendingRequest(true);
      const response = await api.post('/api/review-request', formData);
      
      // Add the new request to the state
      setReviewRequests([response.data, ...reviewRequests]);
      
      setModalOpen(false);
      setSendingRequest(false);
      setError(null);
    } catch (err) {
      setError('Failed to create review request. Please try again.');
      setSendingRequest(false);
      console.error('Error creating review request:', err);
    }
  };

  const handleSendRequest = async (requestId, method) => {
    try {
      const endpoint = method === 'email' 
        ? `/api/review-request/${requestId}/send-email` 
        : `/api/review-request/${requestId}/send-sms`;
      
      await api.post(endpoint);
      
      // Update the request in the state
      setReviewRequests(reviewRequests.map(req => 
        req._id === requestId 
          ? { 
              ...req, 
              status: 'sent', 
              sentAt: new Date(),
              sentVia: method
            } 
          : req
      ));
      
    } catch (err) {
      setError(`Failed to send ${method} request. Please try again.`);
      console.error(`Error sending ${method} request:`, err);
    }
  };

  const handleDeleteClick = (requestId) => {
    setSelectedRequestId(requestId);
    setConfirmAction('delete');
    setConfirmModalOpen(true);
  };

  const handleResendClick = (requestId, method) => {
    setSelectedRequestId(requestId);
    setConfirmAction(`resend-${method}`);
    setConfirmModalOpen(true);
  };

  const confirmActionHandler = async () => {
    if (confirmAction === 'delete') {
      try {
        await api.delete(`/api/review-request/${selectedRequestId}`);
        setReviewRequests(reviewRequests.filter(req => req._id !== selectedRequestId));
        setConfirmModalOpen(false);
      } catch (err) {
        setError('Failed to delete review request. Please try again.');
        console.error('Error deleting review request:', err);
      }
    } else if (confirmAction.startsWith('resend-')) {
      const method = confirmAction.split('-')[1];
      await handleSendRequest(selectedRequestId, method);
      setConfirmModalOpen(false);
    }
  };

  const getFilteredAndSortedRequests = () => {
    let filteredRequests = [...reviewRequests];

    // Apply status filter
    if (filter === 'sent') {
      filteredRequests = filteredRequests.filter(req => req.status === 'sent');
    } else if (filter === 'pending') {
      filteredRequests = filteredRequests.filter(req => req.status === 'pending');
    }

    // Apply sorting
    if (sortBy === 'date') {
      filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'name') {
      filteredRequests.sort((a, b) => a.customerName.localeCompare(b.customerName));
    }

    return filteredRequests;
  };

  const filteredRequests = getFilteredAndSortedRequests();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Review Requests</h1>
        <button
          onClick={handleAddRequest}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Request
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
              Select Business
            </label>
            <select
              id="business"
              value={selectedBusiness}
              onChange={handleBusinessChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Businesses</option>
              {businesses.map((business) => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Requests</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Most Recent</option>
              <option value="name">Customer Name</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <EnvelopeIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No review requests found</h2>
          <p className="text-gray-600 mb-4">
            {selectedBusiness === 'all'
              ? 'You have no review requests yet across any of your businesses.'
              : 'This business has no review requests yet.'}
          </p>
          <button
            onClick={handleAddRequest}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      {request.status === 'sent' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="font-medium">
                        {request.status === 'sent' ? 'Sent' : 'Pending'}
                      </span>
                      {request.status === 'sent' && (
                        <span className="text-sm text-gray-500 ml-2">
                          via {request.sentVia} on {new Date(request.sentAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold">{request.customerName}</h3>
                    
                    <div className="mt-2 flex flex-wrap gap-3">
                      {request.customerEmail && (
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {request.customerEmail}
                        </div>
                      )}
                      {request.customerPhone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {request.customerPhone}
                        </div>
                      )}
                    </div>
                    
                    {request.message && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>
                    )}
                  </div>
                  
                  {request.businessId && businesses.find(b => b._id === request.businessId) && (
                    <div className="bg-gray-100 px-3 py-1 rounded text-sm">
                      {businesses.find(b => b._id === request.businessId).name}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {request.status === 'pending' ? (
                    <>
                      {request.customerEmail && (
                        <button
                          onClick={() => handleSendRequest(request._id, 'email')}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Send Email
                        </button>
                      )}
                      {request.customerPhone && (
                        <button
                          onClick={() => handleSendRequest(request._id, 'sms')}
                          className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          Send SMS
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {request.sentVia === 'email' && request.customerEmail && (
                        <button
                          onClick={() => handleResendClick(request._id, 'email')}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Resend Email
                        </button>
                      )}
                      {request.sentVia === 'sms' && request.customerPhone && (
                        <button
                          onClick={() => handleResendClick(request._id, 'sms')}
                          className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200"
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Resend SMS
                        </button>
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDeleteClick(request._id)}
                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">New Review Request</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label htmlFor="businessId" className="block text-sm font-medium text-gray-700 mb-1">
                    Business *
                  </label>
                  <select
                    id="businessId"
                    name="businessId"
                    value={formData.businessId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a business</option>
                    {businesses.map((business) => (
                      <option key={business._id} value={business._id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Message (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a personal message to your review request..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingRequest ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction === 'delete' 
                ? 'Confirm Deletion' 
                : 'Confirm Resend'}
            </h3>
            <p className="mb-6">
              {confirmAction === 'delete'
                ? 'Are you sure you want to delete this review request?'
                : 'Are you sure you want to resend this review request?'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionHandler}
                className={`px-4 py-2 ${
                  confirmAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-md`}
              >
                {confirmAction === 'delete' ? 'Delete' : 'Resend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewRequests; 