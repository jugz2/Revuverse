import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PlacesAutocomplete } from './GooglePlaces';

const BusinessForm = ({ initialValues = {}, onSubmit, buttonText = 'Save Business' }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
      category: initialValues.category || '',
      address: initialValues.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      contactInfo: initialValues.contactInfo || {
        phone: '',
        email: '',
        website: ''
      },
      socialProfiles: initialValues.socialProfiles || {
        google: {
          placeId: '',
          url: ''
        },
        facebook: {
          pageId: '',
          url: ''
        },
        yelp: {
          businessId: '',
          url: ''
        }
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Business name is required'),
      category: Yup.string().required('Category is required'),
      'address.street': Yup.string().required('Street address is required'),
      'address.city': Yup.string().required('City is required'),
      'address.state': Yup.string().required('State is required'),
      'address.zipCode': Yup.string().required('ZIP code is required'),
      'contactInfo.phone': Yup.string().required('Phone number is required'),
      'contactInfo.email': Yup.string().email('Invalid email address').required('Email is required')
    }),
    onSubmit: (values) => {
      // If a place was selected via Google Places, add the placeId
      if (selectedPlace) {
        values.socialProfiles.google = {
          placeId: selectedPlace.placeId,
          url: selectedPlace.url || `https://search.google.com/local/writereview?placeid=${selectedPlace.placeId}`
        };
      }
      
      onSubmit(values);
    }
  });

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    
    // Auto-fill form fields with place data
    formik.setValues({
      ...formik.values,
      name: place.name || formik.values.name,
      address: {
        street: place.address || formik.values.address.street,
        city: '',  // You would need to parse the formatted_address to get these fields
        state: '',
        zipCode: '',
        country: ''
      },
      contactInfo: {
        ...formik.values.contactInfo,
        phone: place.phoneNumber || formik.values.contactInfo.phone,
        website: place.website || formik.values.contactInfo.website
      },
      socialProfiles: {
        ...formik.values.socialProfiles,
        google: {
          placeId: place.placeId,
          url: place.url || `https://search.google.com/local/writereview?placeid=${place.placeId}`
        }
      }
    });
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Find Your Business on Google</h2>
        <PlacesAutocomplete 
          onPlaceSelect={handlePlaceSelect} 
          placeholder="Search for your business on Google"
          initialValue={initialValues.name || ''}
        />
        <p className="mt-2 text-sm text-gray-500">
          Search for your business to automatically fill in details from Google Places
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Business Name*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.touched.name && formik.errors.name ? 'border-red-300' : ''
              }`}
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...formik.getFieldProps('description')}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category*
            </label>
            <select
              id="category"
              name="category"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.touched.category && formik.errors.category ? 'border-red-300' : ''
              }`}
              {...formik.getFieldProps('category')}
            >
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="salon">Salon</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="healthcare">Healthcare</option>
              <option value="fitness">Fitness</option>
              <option value="education">Education</option>
              <option value="hospitality">Hospitality</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Address</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Street Address*
            </label>
            <input
              id="address.street"
              name="address.street"
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.touched.address?.street && formik.errors.address?.street ? 'border-red-300' : ''
              }`}
              {...formik.getFieldProps('address.street')}
            />
            {formik.touched.address?.street && formik.errors.address?.street && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.address.street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                City*
              </label>
              <input
                id="address.city"
                name="address.city"
                type="text"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formik.touched.address?.city && formik.errors.address?.city ? 'border-red-300' : ''
                }`}
                {...formik.getFieldProps('address.city')}
              />
              {formik.touched.address?.city && formik.errors.address?.city && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.address.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                State/Province*
              </label>
              <input
                id="address.state"
                name="address.state"
                type="text"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formik.touched.address?.state && formik.errors.address?.state ? 'border-red-300' : ''
                }`}
                {...formik.getFieldProps('address.state')}
              />
              {formik.touched.address?.state && formik.errors.address?.state && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.address.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                ZIP/Postal Code*
              </label>
              <input
                id="address.zipCode"
                name="address.zipCode"
                type="text"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formik.touched.address?.zipCode && formik.errors.address?.zipCode ? 'border-red-300' : ''
                }`}
                {...formik.getFieldProps('address.zipCode')}
              />
              {formik.touched.address?.zipCode && formik.errors.address?.zipCode && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.address.zipCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                id="address.country"
                name="address.country"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                {...formik.getFieldProps('address.country')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700">
              Phone Number*
            </label>
            <input
              id="contactInfo.phone"
              name="contactInfo.phone"
              type="tel"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.touched.contactInfo?.phone && formik.errors.contactInfo?.phone ? 'border-red-300' : ''
              }`}
              {...formik.getFieldProps('contactInfo.phone')}
            />
            {formik.touched.contactInfo?.phone && formik.errors.contactInfo?.phone && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.contactInfo.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700">
              Email Address*
            </label>
            <input
              id="contactInfo.email"
              name="contactInfo.email"
              type="email"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.touched.contactInfo?.email && formik.errors.contactInfo?.email ? 'border-red-300' : ''
              }`}
              {...formik.getFieldProps('contactInfo.email')}
            />
            {formik.touched.contactInfo?.email && formik.errors.contactInfo?.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.contactInfo.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactInfo.website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              id="contactInfo.website"
              name="contactInfo.website"
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
              {...formik.getFieldProps('contactInfo.website')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Social Profiles</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="socialProfiles.facebook.url" className="block text-sm font-medium text-gray-700">
              Facebook Page URL
            </label>
            <input
              id="socialProfiles.facebook.url"
              name="socialProfiles.facebook.url"
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://facebook.com/yourbusiness"
              {...formik.getFieldProps('socialProfiles.facebook.url')}
            />
          </div>

          <div>
            <label htmlFor="socialProfiles.yelp.url" className="block text-sm font-medium text-gray-700">
              Yelp Page URL
            </label>
            <input
              id="socialProfiles.yelp.url"
              name="socialProfiles.yelp.url"
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://yelp.com/biz/yourbusiness"
              {...formik.getFieldProps('socialProfiles.yelp.url')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Saving...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default BusinessForm; 