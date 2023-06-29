import { useState, useEffect } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, arrayRemove, updateDoc, deleteField } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'
import { useDispatch, useSelector } from 'react-redux'

import styles from '../styles/Account.module.scss'
import { changeUserLoggedIn, showChosenPhoto, setChosenPhoto } from '../../../infrastructure/store/appState'

import { BsFillTrashFill } from 'react-icons/bs'

export function Account() {
  //Saved images
  const [savedImages, setSavedImages] = useState([])
  const [quizzesScores, setQuizzesScores] = useState({})

  //user object retrieved from auth
  const currentUser = auth.currentUser

  //user's doc reference with saved images
  const userDocRef = doc(db, 'users', currentUser.uid)

  //Dispatch and selector from redux store
  const dispatch = useDispatch()

  async function setFirebaseUserData() {
    const userDocSnapshot = await getDoc(userDocRef)
    if (userDocSnapshot.exists()) {
      if(userDocSnapshot.data().savedImages)
        setSavedImages(userDocSnapshot.data().savedImages)
      if(userDocSnapshot.data().quizzesScores)
        setQuizzesScores(userDocSnapshot.data().quizzesScores)
      
      console.log('AAA', userDocSnapshot.data())
    }
  }
  //CHECKING WHETHER USER IS LOGGED IN
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('Current User: ', user)
    } else {
      console.log('user signed out')
    }
  })
  useEffect(() => {
    setFirebaseUserData()
  }, [])
  //

  async function removeImage(image) {
    const userDocRef = doc(db, 'users', currentUser.uid)
    await updateDoc(userDocRef, { savedImages: arrayRemove(image) })
    //remove image from array
    setSavedImages(savedImages.filter((savedImg) => savedImg.title !== image.title))
    console.log('new saved images:', savedImages)
  }

  //chosen pic in store
  function updateChosenPic(image) {
    dispatch(setChosenPhoto(image))
    dispatch(showChosenPhoto())
  }

  return (
    <div>
      <div>
        <h1>Your Profile</h1>
        <img
          src={auth.currentUser.photoURL ? auth.currentUser.photoURL : './assets/images/image_not_supported.svg'}
          alt="user image"
        />
        <p>{auth.currentUser.displayName}</p>
        <p>{auth.currentUser.email}</p>
      </div>

      <div>
        <h2>Quizzes Scores</h2>
        <div>
          {/* quizzesScores map instead of separate component */}
          <QuizScore title="Mars Quiz" score={quizzesScores?.marsQuestions} quizId="marsQuestions" />
          <QuizScore title="Solar Quiz" score={quizzesScores?.solarQuestions} quizId="solarQuestions" />
          <QuizScore title="NASA Missions Quiz" score={quizzesScores?.vehicleQuestions} quizId="vehicleQuestions" />
        </div>
      </div>
      <div>
        <h2>Saved Images</h2>
        {savedImages.length !== 0 ? (
          <div>
            {savedImages.map((image, index) => (
              <div key={image.title + index} className={styles['image-card']}>
                <div>
                  <img onClick={() => updateChosenPic(image)} src={image.url} alt={image.title} className={styles['fetched-photo']} />
                  <p>{image.title}</p>
                  <button onClick={() => removeImage(image)}>
                    <BsFillTrashFill />
                  </button>
                </div>
                <p>{image.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Save astronomic images to see them here</p>
        )}
      </div>
    </div>
  )
}

function QuizScore(props) {
  async function deleteScore(quiz) {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userRef, { quizzesScores: { [quiz]: '' } })
  }

  return (
    <>
      {props.score && (
        <div>
          <p>{props.title}</p>
          <p>{props.score}</p>
          <button title="Clear Score" onClick={() => deleteScore(props.quizId)}>
            Clear
          </button>
        </div>
      )}
    </>
  )
}
