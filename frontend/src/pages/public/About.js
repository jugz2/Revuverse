import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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
                <Link to="/about" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </Link>
                <Link to="/pricing" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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

      {/* Hero Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">About Revuverse</h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Helping local businesses manage their online reputation and customer feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Empowering Local Businesses
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              At Revuverse, we believe that every local business deserves the tools to thrive in the digital age.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
                <p className="text-lg text-gray-500">
                  Founded in 2023, Revuverse was created to solve the challenges local businesses face in managing their online reputation. 
                  We noticed that while large corporations had sophisticated tools for reputation management, small businesses were left behind.
                  Our platform bridges this gap, providing affordable and effective solutions for businesses of all sizes.
                </p>
              </div>

              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                <ul className="text-lg text-gray-500 space-y-2">
                  <li>• Customer-first approach in everything we do</li>
                  <li>• Transparency and honesty in our business practices</li>
                  <li>• Continuous innovation to provide the best tools</li>
                  <li>• Supporting local economies and communities</li>
                  <li>• Accessibility and inclusivity for all businesses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Team</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Meet the People Behind Revuverse
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              A dedicated team of professionals passionate about helping businesses succeed.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Jane Doe</h3>
                  <p className="text-sm text-blue-600">CEO & Founder</p>
                  <p className="mt-2 text-base text-gray-500">
                    With over 15 years of experience in digital marketing and customer experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">John Smith</h3>
                  <p className="text-sm text-blue-600">CTO</p>
                  <p className="mt-2 text-base text-gray-500">
                    A tech enthusiast with a passion for creating intuitive and powerful software solutions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Emily Johnson</h3>
                  <p className="text-sm text-blue-600">Head of Customer Success</p>
                  <p className="mt-2 text-base text-gray-500">
                    Dedicated to ensuring our customers get the most value from our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

export default About; 