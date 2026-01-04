
// ** React Imports
import { useState, useEffect } from 'react'

// ** Custom Components
import MissionHeader from './MissionHeader'
import MissionList from './MissionList'

import axios from 'axios'

const MissionManagement = () => {
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/mission/status')
        setStats(response?.statistics)
      } catch (error) {
        console.error('Error fetching mission stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div id='mission-management'>
      <MissionHeader stats={stats} />
      <MissionList />
    </div>
  )
}

export default MissionManagement
