import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';

const Feedback = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialBusinessId = queryParams.get('businessId');

  const [feedback, setFeedback] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(initialBusinessId || 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, positive, negative
  const [sortBy, setSortBy] = useState('date'); // date, rating
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [selectedBusiness]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/api/business');
      setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      let url = '/api/feedback';
      if (selectedBusiness !== 'all') {
        url = `/api/feedback?businessId=${selectedBusiness}`;
      }
      const response = await api.get(url);
      setFeedback(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load feedback. Please try again.');
      setLoading(false);
      console.error('Error fetching feedback:', err);
    }
  };

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleReplyClick = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setReplyText('');
    setReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      setSendingReply(true);
      await api.post(`/api/feedback/${selectedFeedback._id}/reply`, { 
        reply: replyText,
        contactMethod: 'email' // or 'sms' based on UI selection
      });
      
      // Update the feedback item in the state
      setFeedback(feedback.map(item => 
        item._id === selectedFeedback._id 
          ? { ...item, businessReply: replyText, repliedAt: new Date() } 
          : item
      ));
      
      setReplyModalOpen(false);
      setSendingReply(false);
    } catch (err) {
      setError('Failed to send reply. Please try again.');
      setSendingReply(false);
      console.error('Error sending reply:', err);
    }
  };

  const getFilteredAndSortedFeedback = () => {
    let filteredFeedback = [...feedback];

    // Apply search filter
    if (searchTerm) {
      filteredFeedback = filteredFeedback.filter(
        item => 
          item.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sentiment filter
    if (filter === 'positive') {
      filteredFeedback = filteredFeedback.filter(item => item.rating >= 4);
    } else if (filter === 'negative') {
      filteredFeedback = filteredFeedback.filter(item => item.rating < 3);
    }

    // Apply sorting
    if (sortBy === 'date') {
      filteredFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'rating') {
      filteredFeedback.sort((a, b) => b.rating - a.rating);
    }

    return filteredFeedback;
  };

  const filteredFeedback = getFilteredAndSortedFeedback();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Feedback</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Filter by Sentiment
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Feedback</option>
              <option value="positive">Positive (4-5 ★)</option>
              <option value="negative">Negative (1-2 ★)</option>
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
              <option value="rating">Rating</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Feedback
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by text, name, or email"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredFeedback.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No feedback found</h2>
          <p className="text-gray-600">
            {selectedBusiness === 'all'
              ? 'You have no feedback yet across any of your businesses.'
              : 'This business has no feedback yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFeedback.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      {item.rating >= 4 ? (
                        <FaceSmileIcon className="h-6 w-6 text-green-500 mr-2" />
                      ) : item.rating <= 2 ? (
                        <FaceFrownIcon className="h-6 w-6 text-red-500 mr-2" />
                      ) : (
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-yellow-500 mr-2" />
                      )}
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Rating: {item.rating}/5</span>
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold">{item.customerName || 'Anonymous'}</h3>
                    <p className="text-gray-700 mt-2">{item.text}</p>
                  </div>
                  {item.businessId && businesses.find(b => b._id === item.businessId) && (
                    <div className="bg-gray-100 px-3 py-1 rounded text-sm">
                      {businesses.find(b => b._id === item.businessId).name}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {item.customerEmail && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {item.customerEmail}
                    </div>
                  )}
                  {item.customerPhone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {item.customerPhone}
                    </div>
                  )}
                </div>

                {item.businessReply ? (
                  <div className="mt-4 bg-blue-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Your Reply:</p>
                    <p className="text-sm text-gray-600 mt-1">{item.businessReply}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Sent on {new Date(item.repliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => handleReplyClick(item)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Reply to this feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">Reply to Feedback</h3>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">From:</span> {selectedFeedback.customerName || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Rating:</span> {selectedFeedback.rating}/5
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Feedback:</span> {selectedFeedback.text}
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-1">
                Your Reply
              </label>
              <textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your response here..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || sendingReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback; 