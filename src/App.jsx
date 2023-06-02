import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import { HeaderNavigation } from './infrastructure/navigation/headerNavigation'
import { Form } from './pages/Account/components/Form'
import { ApodModal } from './pages/APOD/components/Modal'
import Mars from './pages/Mars/components/Mars'
import { Account } from './pages/Account/components/Account'
import { Apod } from './pages/APOD/components/Apod'
import { Quizes } from './pages/Quizes/components/Quizes'
import { LinkHub } from './pages/LinkHub/components/LinkHub'
import Solar from './pages/Solar System/components/Solar'
import StageModels from './pages/Stage Models/components/StageModels'
import PageNotFound from './pages/PageNotFound/components/pageNotFound'

import { useSelector, useDispatch } from 'react-redux'

import { db, auth } from './infrastructure/firebase/firebase'
import { collection, setDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { setUserIn, setUserOut } from './infrastructure/store/appState'

import quizes from './pages/Quizes/components/Questions.json'

export function App() {
  // TODO
  const chosenPhotoShown = useSelector((state) => state.app.chosenPhotoShown)

  const quizCollection = collection(db, 'quizes')
  const dispatch = useDispatch()
  onAuthStateChanged(auth, (potentialUser) => {
    if (potentialUser) {
      dispatch(setUserIn())
    } else {
      dispatch(setUserOut())
    }
  })
  useEffect(() => {
    // TODO
    try {
      setDoc(doc(quizCollection, 'questions'), {
        marsQuestions: [...quizes.marsQuestions],
        solarQuestions: [...quizes.solarQuestions],
        vehicleQuestions: [...quizes.vehicleQuestions],
      })
    } catch (error) {
      console.log('error when adding questions to firestore: ', error)
    }
  }, [])

  return (
    <>
      <HeaderNavigation />
      <Routes>
        <Route exact path="/" element={<LinkHub />} />
        <Route path="/mars" element={<Mars />} />
        <Route path="/account" element={<Account />} />
        <Route path="/apod" element={<Apod />} />
        <Route path="/solar" element={<Solar />} />
        <Route path="/stage" element={<StageModels />} />
        <Route path="/quiz" element={<Quizes />} />
        {/* 404 page */}
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      {/* TODO */}
      {chosenPhotoShown && <ApodModal />}
      <Form />
      {/*  */}
    </>
  )
}
