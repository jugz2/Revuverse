import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  StarIcon, 
  ArrowPathIcon, 
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';

const Reviews = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialBusinessId = queryParams.get('businessId');

  const [reviews, setReviews] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(initialBusinessId || 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, positive, negative
  const [sortBy, setSortBy] = useState('date'); // date, rating
  const [fetchingExternalReviews, setFetchingExternalReviews] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [selectedBusiness]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/api/business');
      setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = '/api/reviews';
      if (selectedBusiness !== 'all') {
        url = `/api/reviews/business/${selectedBusiness}`;
      }
      const response = await api.get(url);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reviews. Please try again.');
      setLoading(false);
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchExternalReviews = async () => {
    if (selectedBusiness === 'all') {
      setError('Please select a business to fetch external reviews');
      return;
    }

    try {
      setFetchingExternalReviews(true);
      await api.post(`/api/reviews/fetch/${selectedBusiness}`);
      await fetchReviews(); // Refresh reviews after fetching
      setFetchingExternalReviews(false);
    } catch (err) {
      setError('Failed to fetch external reviews. Please try again.');
      setFetchingExternalReviews(false);
      console.error('Error fetching external reviews:', err);
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

  const getFilteredAndSortedReviews = () => {
    let filteredReviews = [...reviews];

    // Apply search filter
    if (searchTerm) {
      filteredReviews = filteredReviews.filter(
        review => 
          review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply rating filter
    if (filter === 'positive') {
      filteredReviews = filteredReviews.filter(review => review.rating >= 4);
    } else if (filter === 'negative') {
      filteredReviews = filteredReviews.filter(review => review.rating < 3);
    }

    // Apply sorting
    if (sortBy === 'date') {
      filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'rating') {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    }

    return filteredReviews;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-5 w-5 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const filteredReviews = getFilteredAndSortedReviews();

  if (loading && !fetchingExternalReviews) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              Filter by Rating
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
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
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Reviews
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
                placeholder="Search by text or customer name"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={fetchExternalReviews}
            disabled={fetchingExternalReviews || selectedBusiness === 'all'}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${fetchingExternalReviews ? 'animate-spin' : ''}`} />
            {fetchingExternalReviews ? 'Fetching...' : 'Fetch External Reviews'}
          </button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No reviews found</h2>
          <p className="text-gray-600 mb-4">
            {selectedBusiness === 'all'
              ? 'You have no reviews yet across any of your businesses.'
              : 'This business has no reviews yet.'}
          </p>
          {selectedBusiness !== 'all' && (
            <button
              onClick={fetchExternalReviews}
              disabled={fetchingExternalReviews}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${fetchingExternalReviews ? 'animate-spin' : ''}`} />
              {fetchingExternalReviews ? 'Fetching...' : 'Fetch External Reviews'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold">{review.customerName || 'Anonymous'}</h3>
                  <p className="text-gray-700 mt-2">{review.text}</p>
                  
                  {review.businessReply && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Your Reply:</p>
                      <p className="text-sm text-gray-600 mt-1">{review.businessReply}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {review.source || 'Direct'}
                  </span>
                </div>
              </div>
              
              {!review.businessReply && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/dashboard/reviews/${review._id}/reply`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Reply to this review
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews; 