import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  EnvelopeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    businesses: 0,
    reviewRequests: 0,
    feedback: 0,
    reviews: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, we would fetch actual data from the API
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stats
        setStats({
          businesses: 3,
          reviewRequests: 42,
          feedback: 18,
          reviews: 27,
        });
        
        // Mock recent feedback
        setRecentFeedback([
          {
            id: '1',
            businessName: 'Tasty Bites Restaurant',
            customerName: 'John Doe',
            rating: 2,
            comment: 'The food was cold when it arrived. Service was slow.',
            date: '2023-09-15T14:30:00Z',
            status: 'pending',
          },
          {
            id: '2',
            businessName: 'Glamour Hair Salon',
            customerName: 'Jane Smith',
            rating: 3,
            comment: 'Haircut was okay but not what I asked for.',
            date: '2023-09-14T10:15:00Z',
            status: 'resolved',
          },
          {
            id: '3',
            businessName: 'Tasty Bites Restaurant',
            customerName: 'Mike Johnson',
            rating: 1,
            comment: 'Terrible experience. Will not be coming back.',
            date: '2023-09-13T18:45:00Z',
            status: 'pending',
          },
        ]);
        
        // Mock recent reviews
        setRecentReviews([
          {
            id: '1',
            businessName: 'Tasty Bites Restaurant',
            platform: 'Google',
            customerName: 'Alice Brown',
            rating: 5,
            comment: 'Amazing food and great service!',
            date: '2023-09-16T12:30:00Z',
          },
          {
            id: '2',
            businessName: 'Glamour Hair Salon',
            platform: 'Facebook',
            customerName: 'Bob Wilson',
            rating: 4,
            comment: 'Very professional staff and clean environment.',
            date: '2023-09-15T15:45:00Z',
          },
          {
            id: '3',
            businessName: 'Tech Repair Shop',
            platform: 'Yelp',
            customerName: 'Carol Davis',
            rating: 5,
            comment: 'Fixed my laptop quickly and at a reasonable price.',
            date: '2023-09-14T09:20:00Z',
          },
        ]);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.firstName}! Here's an overview of your business performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <BuildingStorefrontIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Businesses</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.businesses}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/businesses" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <EnvelopeIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Review Requests</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.reviewRequests}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/review-requests" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Feedback</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.feedback}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/feedback" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <StarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Reviews</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.reviews}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/reviews" className="font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentFeedback.map((feedback) => (
              <li key={feedback.id}>
                <Link to={`/dashboard/feedback/${feedback.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">{feedback.businessName}</p>
                        <div className={`ml-2 flex-shrink-0 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          feedback.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {feedback.status === 'resolved' ? 'Resolved' : 'Pending'}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="ml-2 flex-shrink-0 text-sm text-gray-500">
                          {new Date(feedback.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500 truncate">
                          {feedback.comment.length > 100
                            ? `${feedback.comment.substring(0, 100)}...`
                            : feedback.comment}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>From: {feedback.customerName}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Link
              to="/dashboard/feedback"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all feedback
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentReviews.map((review) => (
              <li key={review.id}>
                <Link to={`/dashboard/reviews/${review.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">{review.businessName}</p>
                        <div className="ml-2 flex-shrink-0 inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {review.platform}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="ml-2 flex-shrink-0 text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500 truncate">
                          {review.comment.length > 100
                            ? `${review.comment.substring(0, 100)}...`
                            : review.comment}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>From: {review.customerName}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Link
              to="/dashboard/reviews"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 