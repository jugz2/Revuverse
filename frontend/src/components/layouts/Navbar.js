import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium ${
                    location.pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-block bg-primary-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-primary-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary-600 hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-block bg-primary-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          <div className="ml-4 lg:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto h-full">
              <div className="px-4 pt-5 pb-2 flex">
                <button
                  type="button"
                  className="p-2 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-2">
                <div className="border-b border-gray-200">
                  <div className="px-4 space-y-6 py-6">
                    {navigation.map((link) => (
                      <div key={link.name} className="flow-root">
                        <Link
                          to={link.href}
                          className={`-m-2 p-2 block font-medium ${
                            location.pathname === link.href
                              ? 'text-primary-600'
                              : 'text-gray-900 hover:text-gray-900'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-6 space-y-6">
                  {isAuthenticated ? (
                    <div className="flow-root">
                      <Link
                        to="/dashboard"
                        className="block w-full bg-primary-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white text-center hover:bg-primary-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flow-root">
                        <Link
                          to="/login"
                          className="block w-full bg-white py-2 px-4 border border-gray-300 rounded-md text-base font-medium text-primary-600 text-center hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign in
                        </Link>
                      </div>
                      <div className="flow-root">
                        <Link
                          to="/register"
                          className="block w-full bg-primary-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white text-center hover:bg-primary-700"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign up
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar; 