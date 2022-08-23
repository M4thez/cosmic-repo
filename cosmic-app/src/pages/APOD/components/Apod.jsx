// APOD - Astronomy Picture of the Day
import '../styles/Apod.css'
import React from 'react'
import { useEffect, useState } from 'react';

const API_URL = 'https://api.nasa.gov/planetary/apod?api_key='
const API_KEY = '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND' // Not secure

function CallApodApi() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [image, setImage] = useState('');

  useEffect(() => {
    fetch(API_URL + API_KEY)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setImage(result)
          console.log(result)
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])

  if(error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <div className='apod-image-container'>
        <p>{image.title}</p>
        <img className='apod-image' src={image.url} alt={image.title}/>
        <i>{image.copyright}</i>
      </div>
    )
  }
}

function Apod() {
  return (
    <div>
      <CallApodApi/>

    </div>

  )
}
export default Apod