import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  StarIcon, 
  ArrowPathIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';

const features = [
  {
    name: 'Collect Customer Feedback',
    description: 'Easily collect feedback from your customers through email and SMS. Identify issues before they become public reviews.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Boost Positive Reviews',
    description: 'Automatically direct satisfied customers to leave reviews on Google, Facebook, Yelp, and more.',
    icon: StarIcon,
  },
  {
    name: 'Manage Negative Feedback',
    description: 'Address customer concerns privately before they become public negative reviews.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Monitor Online Reviews',
    description: 'Track and respond to reviews across multiple platforms from a single dashboard.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Business Analytics',
    description: 'Get insights into customer sentiment and track your reputation growth over time.',
    icon: ChartBarIcon,
  },
  {
    name: 'Multi-Business Support',
    description: 'Manage multiple business locations from a single account with our premium plan.',
    icon: BuildingStorefrontIcon,
  },
];

const testimonials = [
  {
    content: "Revuverse has transformed how we handle customer feedback. Our Google rating went from 3.8 to 4.7 in just three months!",
    author: "Sarah Johnson",
    role: "Owner, Tasty Bites Restaurant",
  },
  {
    content: "The ability to catch negative feedback before it becomes a public review has been a game-changer for our business.",
    author: "Michael Chen",
    role: "Manager, Glamour Hair Salon",
  },
  {
    content: "We've seen a 70% increase in online reviews since using Revuverse. The automated follow-ups make all the difference.",
    author: "David Wilson",
    role: "Owner, Tech Repair Shop",
  },
];

const Home = () => {
  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Manage your business</span>{' '}
                  <span className="block text-blue-600 xl:inline">reputation with ease</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Revuverse helps local businesses collect, manage, and leverage customer feedback to improve their online reputation and grow their business.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/pricing"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      View pricing
                    </Link>
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
            alt="Customer reviewing on phone"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage customer feedback
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to collect, analyze, and respond to customer reviews in one place.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Feedback Collection</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Easily collect feedback from customers through customizable forms, QR codes, and direct links.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Analytics Dashboard</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get insights into your customer satisfaction with detailed analytics and reporting tools.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Review Management</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Respond to customer reviews across multiple platforms from a single dashboard.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Alerts & Notifications</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get notified instantly when you receive new reviews or feedback that requires attention.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by businesses everywhere
          </h2>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">
                    Restaurant Owner
                  </p>
                  <div className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">Amazing Tool for Our Restaurant</p>
                    <p className="mt-3 text-base text-gray-500">
                      "Revuverse has transformed how we handle customer feedback. We've seen a 30% increase in positive reviews since we started using it."
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Michael Rodriguez
                    </p>
                    <p className="text-sm text-gray-500">
                      Owner, Taste of Italy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">
                    Retail Store
                  </p>
                  <div className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">Simplified Our Review Process</p>
                    <p className="mt-3 text-base text-gray-500">
                      "Before Revuverse, managing reviews was a nightmare. Now it's streamlined and we can respond to customers quickly and effectively."
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Sarah Johnson
                    </p>
                    <p className="text-sm text-gray-500">
                      Manager, Urban Boutique
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">
                    Service Business
                  </p>
                  <div className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">Worth Every Penny</p>
                    <p className="mt-3 text-base text-gray-500">
                      "The insights we've gained from Revuverse have helped us improve our service quality. Our customer satisfaction scores have never been higher."
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      David Chen
                    </p>
                    <p className="text-sm text-gray-500">
                      Owner, Premier Plumbing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            No credit card required. Try Revuverse free for 14 days.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home; 