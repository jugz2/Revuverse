import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import api from '../../api/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    totalFeedback: 0,
    reviewsBySource: {},
    reviewsByRating: {},
    reviewsOverTime: [],
    feedbackOverTime: [],
    sentimentOverTime: []
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedBusiness, timeRange]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/api/business');
      setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      let url = `/api/analytics?timeRange=${timeRange}`;
      if (selectedBusiness !== 'all') {
        url += `&businessId=${selectedBusiness}`;
      }
      const response = await api.get(url);
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics. Please try again.');
      setLoading(false);
      console.error('Error fetching analytics:', err);
    }
  };

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // Generate chart data
  const generateReviewsOverTimeData = () => {
    const days = parseInt(timeRange, 10);
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    // Generate all dates in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const labels = dateRange.map(date => format(date, 'MMM d'));
    
    // Map the data to the date range
    const reviewsData = new Array(days).fill(0);
    stats.reviewsOverTime.forEach(item => {
      const date = new Date(item.date);
      const dayIndex = dateRange.findIndex(d => 
        d.getDate() === date.getDate() && 
        d.getMonth() === date.getMonth() && 
        d.getFullYear() === date.getFullYear()
      );
      if (dayIndex !== -1) {
        reviewsData[dayIndex] = item.count;
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Reviews',
          data: reviewsData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const generateFeedbackOverTimeData = () => {
    const days = parseInt(timeRange, 10);
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    // Generate all dates in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const labels = dateRange.map(date => format(date, 'MMM d'));
    
    // Map the data to the date range
    const feedbackData = new Array(days).fill(0);
    stats.feedbackOverTime.forEach(item => {
      const date = new Date(item.date);
      const dayIndex = dateRange.findIndex(d => 
        d.getDate() === date.getDate() && 
        d.getMonth() === date.getMonth() && 
        d.getFullYear() === date.getFullYear()
      );
      if (dayIndex !== -1) {
        feedbackData[dayIndex] = item.count;
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Feedback',
          data: feedbackData,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const generateReviewsBySourceData = () => {
    const labels = Object.keys(stats.reviewsBySource);
    const data = Object.values(stats.reviewsBySource);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const generateReviewsByRatingData = () => {
    const labels = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
    const data = [
      stats.reviewsByRating['1'] || 0,
      stats.reviewsByRating['2'] || 0,
      stats.reviewsByRating['3'] || 0,
      stats.reviewsByRating['4'] || 0,
      stats.reviewsByRating['5'] || 0
    ];
    
    return {
      labels,
      datasets: [
        {
          label: 'Reviews by Rating',
          data,
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const generateSentimentOverTimeData = () => {
    const days = parseInt(timeRange, 10);
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    // Generate all dates in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const labels = dateRange.map(date => format(date, 'MMM d'));
    
    // Map the data to the date range
    const sentimentData = new Array(days).fill(0);
    stats.sentimentOverTime.forEach(item => {
      const date = new Date(item.date);
      const dayIndex = dateRange.findIndex(d => 
        d.getDate() === date.getDate() && 
        d.getMonth() === date.getMonth() && 
        d.getFullYear() === date.getFullYear()
      );
      if (dayIndex !== -1) {
        sentimentData[dayIndex] = item.averageRating || 0;
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Average Rating',
          data: sentimentData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Reports</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Reviews</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalReviews}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Average Rating</h2>
          <p className="text-3xl font-bold text-green-600">{stats.averageRating.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Feedback</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalFeedback}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reviews Over Time</h2>
          <div className="h-80">
            <Line data={generateReviewsOverTimeData()} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Feedback Over Time</h2>
          <div className="h-80">
            <Line data={generateFeedbackOverTimeData()} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reviews by Source</h2>
          <div className="h-80">
            <Doughnut data={generateReviewsBySourceData()} options={doughnutOptions} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reviews by Rating</h2>
          <div className="h-80">
            <Bar data={generateReviewsByRatingData()} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Sentiment Trend</h2>
        <div className="h-80">
          <Line data={generateSentimentOverTimeData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics; 