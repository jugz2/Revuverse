import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/solid';

const Pricing = () => {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      price: annual ? 29 : 39,
      description: 'Perfect for small businesses just getting started with online reputation management.',
      features: [
        'Up to 2 business locations',
        'Basic feedback collection forms',
        'Email notifications',
        'Review monitoring',
        'Basic analytics',
        'Email support'
      ],
      cta: 'Start with Starter',
      mostPopular: false,
    },
    {
      name: 'Professional',
      price: annual ? 79 : 99,
      description: 'Ideal for growing businesses looking to enhance their online presence.',
      features: [
        'Up to 5 business locations',
        'Advanced feedback forms',
        'Email and SMS notifications',
        'Review monitoring and management',
        'Detailed analytics and reporting',
        'Priority email support',
        'Review response templates',
        'QR code generation'
      ],
      cta: 'Start with Professional',
      mostPopular: true,
    },
    {
      name: 'Enterprise',
      price: annual ? 199 : 249,
      description: 'For established businesses with multiple locations and advanced needs.',
      features: [
        'Unlimited business locations',
        'Custom feedback forms',
        'Real-time notifications',
        'Advanced review management',
        'Custom analytics dashboard',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      mostPopular: false,
    },
  ];

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">Revuverse</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </Link>
                <Link to="/pricing" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Sign in
              </Link>
              <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <div className="bg-gray-50 pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Choose the plan that's right for your business. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="mt-10 pb-12 bg-gray-50 sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center">
                <div className="relative bg-white rounded-lg p-1 flex">
                  <button
                    type="button"
                    className={`${
                      annual ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'
                    } relative py-2 px-6 border-transparent rounded-md shadow-sm text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10`}
                    onClick={() => setAnnual(true)}
                  >
                    Annual billing
                    <span className={annual ? 'text-white' : 'text-gray-400'}>
                      {' '}
                      (Save 20%)
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`${
                      !annual ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'
                    } ml-0.5 relative py-2 px-6 border-transparent rounded-md shadow-sm text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10`}
                    onClick={() => setAnnual(false)}
                  >
                    Monthly billing
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
                {tiers.map((tier) => (
                  <div key={tier.name} className={`${
                    tier.mostPopular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
                  } rounded-lg shadow-sm divide-y divide-gray-200 bg-white border`}>
                    <div className="p-6">
                      <h2 className="text-lg leading-6 font-medium text-gray-900">{tier.name}</h2>
                      {tier.mostPopular && (
                        <p className="absolute top-0 transform -translate-y-1/2 bg-blue-500 rounded-full px-3 py-0.5 text-sm font-semibold text-white">
                          Most popular
                        </p>
                      )}
                      <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                      <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">${tier.price}</span>
                        <span className="text-base font-medium text-gray-500">/mo</span>
                      </p>
                      <Link
                        to={tier.name === 'Enterprise' ? '/contact' : '/register'}
                        className={`${
                          tier.mostPopular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        } mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium`}
                      >
                        {tier.cta}
                      </Link>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                      <ul role="list" className="mt-6 space-y-4">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex space-x-3">
                            <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
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
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              <div className="pt-6">
                <dt className="text-lg">
                  <span className="font-medium text-gray-900">What is the difference between the plans?</span>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Our plans differ in the number of business locations you can manage, the complexity of feedback forms, notification options, and the level of support provided. The Professional and Enterprise plans also include additional features like review response templates and custom integrations.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg">
                  <span className="font-medium text-gray-900">Can I change my plan later?</span>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg">
                  <span className="font-medium text-gray-900">How does the 14-day free trial work?</span>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  You can sign up for any plan and use all its features for 14 days without being charged. No credit card is required to start your trial. At the end of the trial, you can choose to continue with a paid subscription or cancel.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg">
                  <span className="font-medium text-gray-900">Do you offer discounts for non-profits or educational institutions?</span>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, we offer special pricing for non-profit organizations and educational institutions. Please contact our sales team for more information.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg">
                  <span className="font-medium text-gray-900">What payment methods do you accept?</span>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options.
                </dd>
              </div>
            </dl>
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
          <Link to="/register" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                Home
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2023 Revuverse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing; 