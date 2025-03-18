import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  StarIcon, 
  ChatBubbleLeftRightIcon, 
  BuildingStorefrontIcon, 
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
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
  
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery(
    ['dashboardStats', selectedBusiness],
    async () => {
      if (!selectedBusiness) return null;
      
      // In a real app, we would fetch actual stats from the backend
      // For now, we'll return mock data
      return {
        totalReviews: 87,
        averageRating: 4.2,
        totalFeedback: 124,
        reviewRequests: 210,
        reviewTrend: [
          { month: 'Jan', count: 5 },
          { month: 'Feb', count: 8 },
          { month: 'Mar', count: 12 },
          { month: 'Apr', count: 10 },
          { month: 'May', count: 15 },
          { month: 'Jun', count: 20 },
        ],
        ratingDistribution: {
          5: 45,
          4: 25,
          3: 10,
          2: 5,
          1: 2,
        },
        platformBreakdown: {
          Google: 45,
          Facebook: 20,
          Yelp: 15,
          TripAdvisor: 7,
        },
        recentFeedback: [
          {
            id: '1',
            customerName: 'John Doe',
            rating: 5,
            text: 'Great service, would recommend!',
            date: new Date('2023-06-10'),
          },
          {
            id: '2',
            customerName: 'Jane Smith',
            rating: 4,
            text: 'Good experience overall, but could improve on response time.',
            date: new Date('2023-06-08'),
          },
          {
            id: '3',
            customerName: 'Mike Johnson',
            rating: 5,
            text: 'Excellent customer service!',
            date: new Date('2023-06-05'),
          },
        ],
      };
    },
    {
      enabled: !!selectedBusiness,
    }
  );
  
  // Prepare chart data
  const reviewTrendData = {
    labels: stats?.reviewTrend.map(item => item.month) || [],
    datasets: [
      {
        label: 'Reviews',
        data: stats?.reviewTrend.map(item => item.count) || [],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
      },
    ],
  };
  
  const ratingDistributionData = {
    labels: stats ? Object.keys(stats.ratingDistribution).map(key => `${key} Star`) : [],
    datasets: [
      {
        label: 'Ratings',
        data: stats ? Object.values(stats.ratingDistribution) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      },
    ],
  };
  
  const platformBreakdownData = {
    labels: stats ? Object.keys(stats.platformBreakdown) : [],
    datasets: [
      {
        label: 'Reviews by Platform',
        data: stats ? Object.values(stats.platformBreakdown) : [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  if (isLoadingBusinesses) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (businesses && businesses.length === 0) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">Welcome to Revuverse!</h2>
              <p className="mt-1 text-sm text-gray-500">
                To get started, add your first business.
              </p>
              <div className="mt-6">
                <Link
                  to="/businesses/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Business
                </Link>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          {businesses && businesses.length > 0 && (
            <div className="mt-3 sm:mt-0">
              <select
                id="business-select"
                name="business-select"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={selectedBusiness || ''}
                onChange={(e) => setSelectedBusiness(e.target.value)}
              >
                {businesses.map((business) => (
                  <option key={business._id} value={business._id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Reviews */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <StarIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoadingStats ? '...' : stats?.totalReviews}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/reviews" className="font-medium text-primary-600 hover:text-primary-500">
                    View all
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Average Rating */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <StarIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoadingStats ? '...' : stats?.averageRating.toFixed(1)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/reviews" className="font-medium text-primary-600 hover:text-primary-500">
                    View details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Total Feedback */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Feedback</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoadingStats ? '...' : stats?.totalFeedback}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/feedback" className="font-medium text-primary-600 hover:text-primary-500">
                    View all
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Review Requests */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PaperAirplaneIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Review Requests</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoadingStats ? '...' : stats?.reviewRequests}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/review-requests" className="font-medium text-primary-600 hover:text-primary-500">
                    View all
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Review Trend */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Review Trend</h3>
                <div className="mt-2 h-64">
                  {isLoadingStats ? (
                    <div className="flex justify-center items-center h-full">Loading...</div>
                  ) : (
                    <Line 
                      data={reviewTrendData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Rating Distribution</h3>
                <div className="mt-2 h-64">
                  {isLoadingStats ? (
                    <div className="flex justify-center items-center h-full">Loading...</div>
                  ) : (
                    <Bar 
                      data={ratingDistributionData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Platform Breakdown */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Reviews by Platform</h3>
                <div className="mt-2 h-64 flex justify-center">
                  {isLoadingStats ? (
                    <div className="flex justify-center items-center h-full">Loading...</div>
                  ) : (
                    <div className="w-48">
                      <Doughnut 
                        data={platformBreakdownData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recent Feedback */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Feedback</h3>
                <div className="mt-2">
                  {isLoadingStats ? (
                    <div className="flex justify-center items-center h-64">Loading...</div>
                  ) : (
                    <div className="flow-root">
                      <ul role="list" className="-my-5 divide-y divide-gray-200">
                        {stats?.recentFeedback.map((feedback) => (
                          <li key={feedback.id} className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                                  {feedback.customerName.charAt(0)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {feedback.customerName}
                                </p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                      aria-hidden="true"
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-1 truncate">
                                  {feedback.text}
                                </p>
                              </div>
                              <div className="flex-shrink-0 text-sm text-gray-500">
                                {format(new Date(feedback.date), 'MMM d')}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link
                    to="/feedback"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 