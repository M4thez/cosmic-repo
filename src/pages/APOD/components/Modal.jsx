import React from 'react'

import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsFillPlusCircleFill } from 'react-icons/bs'

import { useDispatch, useSelector } from 'react-redux'
import { hideChosenPhoto } from '../../../infrastructure/store/appState'

import { updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../../infrastructure/firebase/firebase'

import styles from '../styles/Modal.module.scss'

export function ApodModal() {
  const dispatch = useDispatch()
  const chosenPhoto = useSelector((state) => state.app.chosenPhoto)
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)

  const location = window.location.pathname
  console.log(location)

  async function saveToProfile() {
    const currentUserRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(currentUserRef, { savedImages: arrayUnion({ ...chosenPhoto }) })
    alert('You saved an image.')
  }
  return (
    <div className={styles['container']}>
      <div className={styles['container-close']}>
        <button id={styles['close']} onClick={() => dispatch(hideChosenPhoto())}>
          <AiOutlineCloseCircle />
        </button>
      </div>
      <div className={styles['content-box']}>
        <div className={styles['img-box']}>
          <img src={chosenPhoto.url} />
        </div>
        <div className={styles['info']}>
          <h1>{chosenPhoto.title}</h1>
          <p className={styles['explanation']}>{chosenPhoto.explanation}</p>
          {userLoggedIn && (
            <div className={styles['add-btn-container']}>
              {location !== '/account' && (
                <button className={styles['add-btn']} onClick={saveToProfile}>
                  <BsFillPlusCircleFill /> Save to Your Gallery
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
