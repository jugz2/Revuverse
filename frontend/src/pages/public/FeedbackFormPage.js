import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import api from '../../api/api';

const FeedbackFormPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [requestData, setRequestData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showRedirectOptions, setShowRedirectOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await api.get(`/review-request/form/${requestId}`);
        setRequestData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching request data:', error);
        toast.error('Unable to load feedback form. The link may be invalid or expired.');
        setIsLoading(false);
      }
    };

    fetchRequestData();
  }, [requestId]);

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validationSchema: Yup.object({
      comment: Yup.string().required('Please provide some feedback'),
    }),
    onSubmit: async (values) => {
      if (rating === 0) {
        toast.error('Please select a rating');
        return;
      }

      setSubmitting(true);

      try {
        const response = await api.post(`/feedback/submit/${requestData.business._id}`, {
          rating,
          comment: values.comment,
          requestId,
        });

        if (rating >= 4) {
          // For positive ratings (4-5 stars), show redirect options
          setShowRedirectOptions(true);
        } else {
          // For negative ratings (1-3 stars), show thank you message
          toast.success('Thank you for your feedback! We appreciate your input and will use it to improve our service.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Unable to submit feedback. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRedirect = (platform) => {
    let url;
    
    switch (platform) {
      case 'google':
        url = requestData.business.socialProfiles?.google?.url || 
              `https://search.google.com/local/writereview?placeid=${requestData.business.socialProfiles?.google?.placeId}`;
        break;
      case 'facebook':
        url = requestData.business.socialProfiles?.facebook?.url;
        break;
      case 'yelp':
        url = requestData.business.socialProfiles?.yelp?.url;
        break;
      default:
        url = '/';
    }
    
    window.open(url, '_blank');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Invalid Request</h2>
          <p className="mt-2 text-sm text-gray-600">
            The feedback form you're trying to access is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (showRedirectOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Thank You!</h2>
            <p className="mt-2 text-sm text-gray-600">
              We appreciate your positive feedback! Would you mind sharing your experience on one of these platforms?
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {requestData.business.socialProfiles?.google && (
              <button
                onClick={() => handleRedirect('google')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Review on Google
              </button>
            )}
            {requestData.business.socialProfiles?.facebook && (
              <button
                onClick={() => handleRedirect('facebook')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Review on Facebook
              </button>
            )}
            {requestData.business.socialProfiles?.yelp && (
              <button
                onClick={() => handleRedirect('yelp')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
              >
                Review on Yelp
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            How was your experience?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {requestData.business.name} would love to hear your feedback
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <div className="flex items-center justify-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <button
                      type="button"
                      key={ratingValue}
                      className={`h-10 w-10 ${
                        ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {ratingValue <= (hover || rating) ? (
                        <StarIcon className="h-10 w-10" />
                      ) : (
                        <StarIconOutline className="h-10 w-10" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {rating > 0 && (
              <p className="mt-2 text-center text-sm font-medium text-gray-700">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Your feedback
            </label>
            <div className="mt-1">
              <textarea
                id="comment"
                name="comment"
                rows={4}
                className={`shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border ${
                  formik.touched.comment && formik.errors.comment
                    ? 'border-red-300'
                    : 'border-gray-300'
                } rounded-md`}
                placeholder="Tell us about your experience..."
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.comment && formik.errors.comment && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.comment}</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackFormPage; 