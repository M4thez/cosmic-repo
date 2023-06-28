// APOD - Astronomy Picture of the Day
import React from 'react'
import { useEffect, useState } from 'react'

import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../../infrastructure/firebase/firebase'

import { useDispatch, useSelector } from 'react-redux'
import { setChosenPhoto, showChosenPhoto } from '../../../infrastructure/store/appState'

import { BiErrorCircle } from "react-icons/bi";

import style from '../styles/Apod.module.scss'
import LoaderDots from '../../../infrastructure/loader/LoaderDots'

const API_URL = 'https://api.nasa.gov/planetary/apod?api_key='
const API_KEY = '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND'

// Note: concept_tags functionality is turned off in API
export function Apod() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [image, setImage] = useState('')
  const [fetchedImages, setFetchedImages] = useState([])
  const [apodStartDate, setStartDate] = useState('')
  const [apodEndDate, setEndDate] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [apodErr, setApodErr] = useState(false)

  const randomImageCount = '&count=4'

  //checking user status
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)

  function downloadImage() {
    window.open(image.hdurl)
  }

  useEffect(() => {
    fetch(API_URL + API_KEY)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setImage(result)
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
    fetch(API_URL + API_KEY + randomImageCount)
      .then((res) => res.json())
      .then(
        (result) => {
          setFetchedImages(result)
        },
        (error) => console.warn('Error appeared: ', error)
      )
  }, [])
  async function saveToProfile(image) {
    const currentUserRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(currentUserRef, { savedImages: arrayUnion({ ...image }) })
    console.log(`image ${image.title} successfully added`)
  }
  //set chosen pic function
  const dispatch = useDispatch()
  function updateChosenPic(image) {
    dispatch(setChosenPhoto(image))
    dispatch(showChosenPhoto())
  }

  //filter function
  async function getImages(numberOfImages) {
    const imageCount = `&count=${numberOfImages}`
    await fetch(API_URL + API_KEY + imageCount)
      .then((res) => res.json())
      .then(
        (result) => {
          setFetchedImages(result)
        },
        (error) => console.warn('Error appeared: ', error)
      )
  }
  //search by date function
  async function getImagesByDates() {
    const startDate = `&start_date=${apodStartDate}`
    const endDate = `&end_date=${apodEndDate}`
    await fetch(API_URL + API_KEY + startDate + endDate)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.code === 400) {
            setApodErr(true)
            setErrorMsg(result.msg)
            console.log(result)
          } else {
            setApodErr(false)
            console.log(result)
            setFetchedImages(result)
          }
        },
        (error) => console.warn('Error appeared: ', error)
      )
  }

  if (error) {
    return (
      <div className={style.pageError}>
        <BiErrorCircle />
        <p>Error appeared - APOD service unavailable</p>
      </div>
    )
  } else if (!isLoaded) {
    return <LoaderDots title="Astronomy Picture of the Day" />
  } else {
    return (
      <main className={style.mainContainer}>
        <h1>Astronomy Picture of the Day</h1>
        <section className={style.apodContentContainer}>
          <div className={style.apodImageContainer}>
            <img
              className={style.apodImageCol + ' ' + style.apodImage}
              src={image.media_type === 'image' ? image.url : './assets/images/image_not_supported.svg'}
              alt={image.title}
            />
            <div className={style.apodInfo + ' ' + style.apodImageCol}>
              <p>
                <b>{image.title}</b>
              </p>
              <p>{image.explanation}</p>
              <p>{image.date}</p>
              {/* Conditionally render copyright if it exists */}
              {image.copyright && (
                <p>
                  <i>@{image.copyright}</i>
                </p>
              )}
            </div>
          </div>
          <div className={style.apodButtons}>
            <button onClick={downloadImage}>Download</button>
            {userLoggedIn && <button onClick={() => saveToProfile(image)}>Save</button>}
          </div>
        </section>
        <section className={style['custom-images-container']}>
          <p className={style['images-header']}>Discover more</p>
          <div className={style['filters']}>
            <div>
              <button onClick={() => getImages(4)}>
                Random 4 Images
              </button>
              <button onClick={() => getImages(8)}>
                Random 8 Images
              </button>
            </div>
            <div className={style['dates-div']}>
              <label htmlFor="start-date">From</label>
              <input
                className={style['date-input']}
                type="date"
                id="start-date"
                onChange={(event) => {
                  setStartDate(event.target.value)
                  console.log(apodStartDate)
                }}
              />
              <label htmlFor="end-date">To</label>
              <input
                className={style['date-input']}
                type="date"
                id="end-date"
                onChange={(event) => {
                  setEndDate(event.target.value)
                  console.log('end', apodEndDate)
                }}
              />
              <button onClick={() => getImagesByDates()}>
                Search by date
              </button>
            </div>
          </div>
          <div className={style['cards']}>
            {!apodErr ? (
              fetchedImages.map((image, index) => (
                <div key={image.title+index} className={style['image-card']}>
                  <div className={style['image-div']}>
                    <img
                      onClick={() => updateChosenPic(image)}
                      src={image.media_type === 'image' ? image.url : './assets/images/image_not_supported.svg'}
                      alt={image.title}
                    />
                  </div>
                  <div className={style['image-text']}>
                    <p>{image.title}</p>
                    {userLoggedIn && (
                      <button title="Save image to profile" onClick={() => saveToProfile(image)}>
                        SAVE
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <h2>{errorMsg}</h2>
            )}
          </div>
        </section>
      </main>
    )
  }
}
