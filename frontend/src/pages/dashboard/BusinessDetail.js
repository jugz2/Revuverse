import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  StarIcon, 
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';
import { BusinessMap } from '../../components/GooglePlaces';

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    reviews: 0,
    feedback: 0,
    averageRating: 0,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/business/${id}`);
      setBusiness(response.data);
      
      // Fetch stats
      const statsResponse = await api.get(`/api/business/${id}/stats`);
      setStats(statsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load business details. Please try again.');
      setLoading(false);
      console.error('Error fetching business details:', err);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/business/${id}`);
      setDeleteModalOpen(false);
      navigate('/dashboard/businesses');
    } catch (err) {
      setError('Failed to delete business. Please try again.');
      console.error('Error deleting business:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          to="/dashboard/businesses"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Businesses
        </Link>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Business not found.
        </div>
        <Link
          to="/dashboard/businesses"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Businesses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/dashboard/businesses"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Businesses
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{business.name}</h1>
              <p className="text-gray-600 mb-4">{business.category}</p>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/dashboard/businesses/edit/${business._id}`}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Business Information</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{business.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{business.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{business.email}</p>
                  </div>
                </div>
                {business.website && (
                  <div className="flex items-start">
                    <GlobeAltIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Google Map if we have coordinates */}
              {business.socialProfiles?.google?.placeId && (
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Location</h3>
                  <div className="h-64">
                    <BusinessMap 
                      location={{ lat: 37.7749, lng: -122.4194 }} // Default to San Francisco if no coordinates
                      businessName={business.name}
                      height={250}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}&query_place_id=${business.socialProfiles.google.placeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium">Average Rating</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-medium">Total Reviews</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{stats.reviews}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-medium">Feedback</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{stats.feedback}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to={`/dashboard/reviews?businessId=${business._id}`}
              className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow flex items-center"
            >
              <StarIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <span className="font-medium">View Reviews</span>
            </Link>
            <Link
              to={`/dashboard/feedback?businessId=${business._id}`}
              className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow flex items-center"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500 mr-3" />
              <span className="font-medium">View Feedback</span>
            </Link>
            <Link
              to={`/dashboard/review-requests?businessId=${business._id}`}
              className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow flex items-center"
            >
              <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-3" />
              <span className="font-medium">Send Review Requests</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete {business.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetail; 