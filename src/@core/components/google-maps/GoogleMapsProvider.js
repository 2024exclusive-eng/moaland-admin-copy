import React from 'react'
import { LoadScript } from '@react-google-maps/api'
import PropTypes from 'prop-types'

const libraries = ['places']

const GoogleMapsProvider = ({ children }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    console.warn('Google Maps API key is not configured. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file.')
    return <>{children}</>
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      loadingElement={<div>Loading Maps...</div>}
      preventGoogleFontsLoading={false}
    >
      {children}
    </LoadScript>
  )
}

GoogleMapsProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default GoogleMapsProvider
