import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  CheckIcon, 
  XMarkIcon, 
  CreditCardIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription plans
      const plansResponse = await api.get('/api/subscription/plans');
      setPlans(plansResponse.data);
      
      // Fetch billing history
      const historyResponse = await api.get('/api/subscription/history');
      setBillingHistory(historyResponse.data);
      
      // Fetch payment methods
      const paymentResponse = await api.get('/api/subscription/payment-methods');
      setPaymentMethods(paymentResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load subscription data. Please try again.');
      setLoading(false);
      console.error('Error fetching subscription data:', err);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/api/subscription/payment-methods', cardForm);
      
      // Refresh payment methods
      const paymentResponse = await api.get('/api/subscription/payment-methods');
      setPaymentMethods(paymentResponse.data);
      
      setCardForm({
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
        cardName: ''
      });
      
      setShowAddCard(false);
      setSuccess('Payment method added successfully');
      setProcessingPayment(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment method');
      setProcessingPayment(false);
    }
  };

  const handleRemoveCard = async (paymentMethodId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      try {
        await api.delete(`/api/subscription/payment-methods/${paymentMethodId}`);
        
        // Refresh payment methods
        const paymentResponse = await api.get('/api/subscription/payment-methods');
        setPaymentMethods(paymentResponse.data);
        
        setSuccess('Payment method removed successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to remove payment method');
      }
    }
  };

  const handleSubscribe = async (planId) => {
    if (paymentMethods.length === 0) {
      setError('Please add a payment method before subscribing');
      setShowAddCard(true);
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      await api.post('/api/subscription/checkout', {
        planId,
        paymentMethodId: paymentMethods[0].id // Use the first payment method by default
      });
      
      // Refresh user data to get updated subscription
      const userResponse = await api.get('/api/auth/me');
      updateUser(userResponse.data);
      
      // Refresh billing history
      const historyResponse = await api.get('/api/subscription/history');
      setBillingHistory(historyResponse.data);
      
      setSuccess('Subscription updated successfully');
      setProcessingPayment(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process subscription');
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      try {
        await api.post('/api/subscription/cancel');
        
        // Refresh user data to get updated subscription
        const userResponse = await api.get('/api/auth/me');
        updateUser(userResponse.data);
        
        setSuccess('Subscription canceled successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel subscription');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100); // Assuming amount is in cents
  };

  const formatCardNumber = (number) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Subscription & Billing</h1>
      
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
      
      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Subscription</h2>
        
        {user?.subscription?.plan ? (
          <div>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-blue-800 mb-2">
                {plans.find(p => p.id === user.subscription.planId)?.name || user.subscription.plan}
              </h3>
              <p className="text-blue-600 mb-2">
                Status: <span className="font-medium">{user.subscription.status}</span>
              </p>
              {user.subscription.status === 'active' && (
                <p className="text-blue-600">
                  Your subscription will renew on {formatDate(user.subscription.expiresAt)}
                </p>
              )}
              {user.subscription.status === 'canceled' && (
                <p className="text-yellow-600">
                  Your subscription has been canceled and will expire on {formatDate(user.subscription.expiresAt)}
                </p>
              )}
            </div>
            
            {user.subscription.status === 'active' && (
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-600 mb-4">
            You are currently on the free plan with limited features.
          </p>
        )}
      </div>
      
      {/* Subscription Plans */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`border rounded-lg overflow-hidden ${
                user?.subscription?.planId === plan.id 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {formatCurrency(plan.price)}<span className="text-sm font-normal text-gray-500">/month</span>
                </p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={processingPayment || user?.subscription?.planId === plan.id}
                  className={`w-full px-4 py-2 rounded-md ${
                    user?.subscription?.planId === plan.id
                      ? 'bg-gray-100 text-gray-800 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {user?.subscription?.planId === plan.id
                    ? 'Current Plan'
                    : processingPayment
                      ? 'Processing...'
                      : 'Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Payment Methods</h2>
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAddCard ? 'Cancel' : '+ Add Payment Method'}
          </button>
        </div>
        
        {showAddCard && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-gray-800 mb-4">Add New Payment Method</h3>
            <form onSubmit={handleAddCard}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardForm.cardName}
                    onChange={handleCardInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={handleCardInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div>
                  <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={cardForm.cardExpiry}
                    onChange={handleCardInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cardCvc"
                    name="cardCvc"
                    value={cardForm.cardCvc}
                    onChange={handleCardInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={processingPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingPayment ? 'Processing...' : 'Add Payment Method'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {paymentMethods.length === 0 ? (
          <p className="text-gray-600">No payment methods added yet.</p>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <CreditCardIcon className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">{formatCardNumber(method.last4)}</p>
                    <p className="text-sm text-gray-500">Expires {method.expMonth}/{method.expYear}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCard(method.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Billing History */}
      <div id="billing-history" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing History</h2>
        
        {billingHistory.length === 0 ? (
          <p className="text-gray-600">No billing history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.invoiceUrl && (
                        <a 
                          href={invoice.invoiceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription; 