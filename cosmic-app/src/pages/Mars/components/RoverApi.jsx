import style from '../styles/RoverApi.module.scss'
import React, { useState, useEffect } from 'react'
import RoverForm from './RoverForm'

export default function RoverApi() {
  const [isInitialLoaded, setInitialLoaded] = useState(false)
  const [initialError, setInitialError] = useState(false)
  const [initialData, setInitialData] = useState([])
  const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1'

  // run on start
  useEffect(() => {
    fetch(BASE_URL + '/rovers?api_key=' + import.meta.env.VITE_NASA_API_KEY)
      .then((res) => res.json())
      .then((result) => {
        setInitialData(result.rovers)
        setInitialLoaded(true)
        console.log(result.rovers)
      }),
      (error) => {
        setInitialLoaded(true)
        setInitialError(error)
      }
  }, [])

  return (
    <section className={style.roverApi}>
      <h2>Mars Rover Photos</h2>
      <div className={style.formsContainer}>
        {isInitialLoaded && !initialError ? <RoverForm data={initialData} baseUrl={BASE_URL} apiKey={import.meta.env.VITE_NASA_API_KEY}/> : <div className={style.loading}>Loading...</div>}
      </div>
    </section>
  )
}
