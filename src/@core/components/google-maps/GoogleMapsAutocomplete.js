import { useState, useRef, useCallback, useEffect } from 'react'
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'
import { Input } from 'reactstrap'
import PropTypes from 'prop-types'
import './GoogleMapsAutocomplete.scss'

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  marginTop: '12px'
}

const defaultCenter = {
  lat: 37.5665,
  lng: 126.978
}

const GoogleMapsAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  latitude,
  longitude,
  placeholder,
  className,
  name
}) => {
  const [map, setMap] = useState(null)
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null
  )

  const autocompleteRef = useRef(null)

  // Update marker position when latitude/longitude props change
  useEffect(() => {
    if (latitude && longitude) {
      const position = { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      setMarkerPosition(position)

      // Pan map to the position if map is loaded
      if (map) {
        map.panTo(position)
        map.setZoom(15)
      }
    }
  }, [latitude, longitude, map])

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance)
  }, [])

  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete
  }, [])

  // Helper function to get address in a specific language
  const getAddressInLanguage = useCallback((lat, lng, language) => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode(
        { location: { lat, lng }, language },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].formatted_address)
          } else {
            resolve('')
          }
        }
      )
    })
  }, [])

  const onPlaceChanged = useCallback(async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const address = place.formatted_address || ''

        // Update marker position
        const position = { lat, lng }
        setMarkerPosition(position)

        // Pan map to new location
        if (map) {
          map.panTo(position)
          map.setZoom(15)
        }

        // Fetch addresses in Korean, Chinese, and English
        const [addressKo, addressCn, addressEn] = await Promise.all([
          getAddressInLanguage(lat, lng, 'ko'),
          getAddressInLanguage(lat, lng, 'zh-CN'),
          getAddressInLanguage(lat, lng, 'en')
        ])

        // Call parent callback with place data including all languages
        if (onPlaceSelect) {
          onPlaceSelect({
            address: addressKo || address,
            addressCn: addressCn || '',
            addressEn: addressEn || '',
            latitude: lat,
            longitude: lng,
            placeId: place.place_id,
            name: place.name || ''
          })
        }

        // Update input value with Korean address
        if (onChange) {
          onChange({
            target: {
              name,
              value: addressKo || address,
              latitude: lat,
              longitude: lng
            }
          })
        }
      }
    }
  }, [map, onChange, onPlaceSelect, getAddressInLanguage])

  const handleInputChange = useCallback((e) => {
    if (onChange) {
      onChange(e)
    }
  }, [onChange])

  const handleMapClick = useCallback(async (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    const position = { lat, lng }

    // Update marker position immediately
    setMarkerPosition(position)

    // Fetch addresses in Korean, Chinese, and English
    const [addressKo, addressCn, addressEn] = await Promise.all([
      getAddressInLanguage(lat, lng, 'ko'),
      getAddressInLanguage(lat, lng, 'zh-CN'),
      getAddressInLanguage(lat, lng, 'en')
    ])

    if (addressKo) {
      // Call parent callback with place data including all languages
      if (onPlaceSelect) {
        onPlaceSelect({
          address: addressKo,
          addressCn: addressCn || '',
          addressEn: addressEn || '',
          latitude: lat,
          longitude: lng,
          placeId: null,
          name: ''
        })
      }

      // Update input value with Korean address
      if (onChange) {
        onChange({
          target: {
            name: name || 'address',
            value: addressKo
          }
        })
      }
    } else {
      console.warn('Geocoder failed to get address')
      // Still update coordinates even if address lookup fails
      if (onPlaceSelect) {
        onPlaceSelect({
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressCn: '',
          addressEn: '',
          latitude: lat,
          longitude: lng,
          placeId: null,
          name: ''
        })
      }
    }
  }, [onChange, onPlaceSelect, name, getAddressInLanguage])

  return (
    <div className="google-maps-autocomplete">
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: ['kr', 'jp', 'cn', 'id'] },
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        }}
      >
        <Input
          type="text"
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder || '주소를 입력하거나 검색하세요'}
          className={className}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition || defaultCenter}
        zoom={markerPosition ? 15 : 11}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        }}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  )
}

GoogleMapsAutocomplete.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onPlaceSelect: PropTypes.func,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string
}

export default GoogleMapsAutocomplete
