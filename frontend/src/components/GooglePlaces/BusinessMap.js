import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Business Map component
 * Displays a Google Map centered on a business location
 * 
 * @param {Object} props - Component props
 * @param {Object} props.location - Location coordinates {lat, lng}
 * @param {string} props.businessName - Name of the business
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.zoom - Map zoom level
 * @param {number} props.height - Map height in pixels
 */
const BusinessMap = ({ 
  location, 
  businessName, 
  className = '', 
  zoom = 15,
  height = 300
}) => {
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [map, setMap] = useState(null);

  // Load Google Maps script
  useEffect(() => {
    // Skip if already loaded
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
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

  // Initialize map
  useEffect(() => {
    if (!loaded || !mapRef.current || !location) return;

    const mapOptions = {
      center: location,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add marker for business location
    new window.google.maps.Marker({
      position: location,
      map: newMap,
      title: businessName,
      animation: window.google.maps.Animation.DROP
    });

  }, [loaded, location, businessName, zoom]);

  // Update map when location changes
  useEffect(() => {
    if (map && location) {
      map.setCenter(location);
    }
  }, [map, location]);

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height: `${height}px`, width: '100%' }}
    />
  );
};

BusinessMap.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  businessName: PropTypes.string,
  className: PropTypes.string,
  zoom: PropTypes.number,
  height: PropTypes.number
};

export default BusinessMap; 