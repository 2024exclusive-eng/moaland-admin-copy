import React, { Suspense } from 'react'

// ** Router Import
import Router from './router/Router'

// ** Google Maps Provider
import { GoogleMapsProvider } from '@components/google-maps'

const App = () => {
  return (
    <Suspense fallback={null}>
      <GoogleMapsProvider>
        <Router />
      </GoogleMapsProvider>
    </Suspense>
  )
}

export default App
