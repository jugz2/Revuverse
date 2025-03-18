import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Google Places Autocomplete component
 * This component provides an input field with Google Places autocomplete functionality
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onPlaceSelect - Callback function when a place is selected
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.initialValue - Initial input value
 */
const PlacesAutocomplete = ({ 
  onPlaceSelect, 
  placeholder = 'Search for a business', 
  className = '',
  initialValue = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    // Skip if already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setLoaded(true);
      return;
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      setLoaded(true);
    });

    return () => {
      googleMapScript.removeEventListener('load', () => {
        setLoaded(true);
      });
    };
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!loaded || !inputRef.current) return;

    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ['establishment'] }
    );

    autoCompleteRef.current.addListener('place_changed', () => {
      const place = autoCompleteRef.current.getPlace();
      
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        console.log("No details available for input: '" + place.name + "'");
        return;
      }

      // Format the place data
      const placeData = {
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        url: place.url,
        website: place.website,
        phoneNumber: place.formatted_phone_number,
        types: place.types,
        photos: place.photos?.map(photo => ({
          url: photo.getUrl(),
          height: photo.height,
          width: photo.width
        })) || []
      };

      // Call the callback with the place data
      onPlaceSelect(placeData);
      
      // Update input value
      setInputValue(place.name);
    });

    return () => {
      if (autoCompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
  }, [loaded, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

PlacesAutocomplete.propTypes = {
  onPlaceSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  initialValue: PropTypes.string
};

export default PlacesAutocomplete; 