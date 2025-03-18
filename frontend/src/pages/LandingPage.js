import React from 'react';
import { Link } from 'react-router-dom';
import { 
  StarIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  PaperAirplaneIcon, 
  ShieldCheckIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Automated Review Collection',
    description: 'Send personalized review requests via email and SMS to your customers with just a few clicks.',
    icon: StarIcon,
  },
  {
    name: 'Smart Feedback Routing',
    description: 'Positive feedback gets directed to public review sites, while negative feedback comes to you privately.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Multi-Platform Integration',
    description: 'Connect with Google, Facebook, Yelp, TripAdvisor, and more to manage all your reviews in one place.',
    icon: PaperAirplaneIcon,
  },
  {
    name: 'Sentiment Analysis',
    description: 'Understand customer sentiment with AI-powered analysis of feedback and reviews.',
    icon: ChartBarIcon,
  },
  {
    name: 'Reputation Protection',
    description: 'Catch negative feedback before it becomes public, giving you a chance to resolve issues privately.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Performance Insights',
    description: 'Track your review growth and customer satisfaction with detailed analytics and reports.',
    icon: ArrowTrendingUpIcon,
  },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for small businesses just getting started with online reviews.',
    features: [
      '50 review requests per month',
      'Email review requests',
      'Basic feedback collection',
      'Single business profile',
    ],
    cta: 'Start for free',
    mostPopular: false,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'per month',
    description: 'Everything you need to build and manage your online reputation.',
    features: [
      'Unlimited review requests',
      'Email & SMS review requests',
      'Advanced feedback analysis',
      'Multiple business profiles',
      'Review monitoring across platforms',
      'Reply to reviews from dashboard',
      'Weekly performance reports',
    ],
    cta: 'Get started',
    mostPopular: true,
  },
];

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-2xl font-bold text-primary-600">Revuverse</span>
            </div>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Boost your business with</span>{' '}
                  <span className="block text-primary-600 xl:inline">better reviews</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Automate customer feedback collection, increase positive online reviews, and manage your reputation across all platforms in one place.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="Happy business owner"
          />
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your online reputation
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Revuverse helps local businesses collect customer feedback, get more positive reviews, and manage their online reputation.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Start for free, upgrade when you need more features.
            </p>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
            {pricing.map((tier) => (
              <div key={tier.name} className={`rounded-lg shadow-lg divide-y divide-gray-200 ${tier.mostPopular ? 'border-2 border-primary-500' : 'border border-gray-200'}`}>
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{tier.name}</h2>
                  <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                    {tier.period && <span className="text-base font-medium text-gray-500">{tier.period}</span>}
                  </p>
                  <Link
                    to="/register"
                    className={`mt-8 block w-full bg-${tier.mostPopular ? 'primary-600 hover:bg-primary-700' : 'white hover:bg-gray-50'} border border-${tier.mostPopular ? 'primary-600' : 'gray-300'} rounded-md py-2 text-sm font-semibold text-${tier.mostPopular ? 'white' : 'gray-700'} text-center`}
                  >
                    {tier.cta}
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your online reputation?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Start collecting customer feedback and growing your positive reviews today.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">&copy; 2023 Revuverse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 