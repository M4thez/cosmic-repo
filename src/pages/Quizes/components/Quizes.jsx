import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { updateDoc, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../../infrastructure/firebase/firebase'
import styles from '../styles/Quizes.module.scss'
import { Link } from 'react-router-dom'

export function Quizes() {
  const [currentQuestionIndex, addIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [explanationVisible, setExplanationVisibility] = useState(false)
  const [summaryVisible, setSummaryVisibility] = useState(false)
  const [chosenQuiz, setChosenQuiz] = useState('marsQuestions')
  const [showQuizSelection, setShowQuizSelection] = useState(true)
  const [quizVisible, setQuizVisible] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(true)
  const [quizesFirestore, setQuizesFirestore] = useState({})
  
  console.log('quizesFirestore:', quizesFirestore)
  
  //questions ref
  const questionsRef = doc(db, 'quizes', 'questions')
  
  //getting user login state
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)
  
  //background video 
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current.playbackRate = 0.6;
  }, []);  
  
  function choseQuiz(quiz) {
    setChosenQuiz(quiz)
    setShowQuizSelection(false)
    setQuizVisible(true)
  }

  async function toggleNextQuestion() {
    if (currentQuestionIndex < quizesFirestore[chosenQuiz].length - 1) {
      addIndex(currentQuestionIndex + 1)
      setExplanationVisibility(false)
      setQuizVisible(true)
    } else {
      setExplanationVisibility(true)
      setQuizVisible(false)
      try {
        if (userLoggedIn) {
          //user ref
          const currentUserRef = doc(db, 'users', auth.currentUser.uid)
          console.log('saving score', currentUserRef)
          if (chosenQuiz === 'marsQuestions') {
            await updateDoc(currentUserRef, { marsQuiz: `${score}/${quizesFirestore[chosenQuiz].length}` })
          } else if (chosenQuiz === 'solarQuestions') {
            await updateDoc(currentUserRef, { solarQuiz: `${score}/${quizesFirestore[chosenQuiz].length}` })
          } else if (chosenQuiz === 'vehicleQuestions') {
            await updateDoc(currentUserRef, { vehicleQuiz: `${score}/${quizesFirestore[chosenQuiz].length}` })
          }
        }
      } catch (error) {
        console.log('Error when upadting quiz score', error)
      }
    }
    if (currentQuestionIndex + 1 === quizesFirestore[chosenQuiz].length) {
      setExplanationVisibility(false)
      setSummaryVisibility(true)
    }
  }
  function retryQuiz() {
    addIndex(0)
    setScore(0)
    setExplanationVisibility(false)
    setSummaryVisibility(false)
    setQuizVisible(false)
    setShowQuizSelection(true)
  }

  function answerChosen(answer) {
    if (answer) {
      setScore(score + 1)
      setExplanationVisibility(true)
      setQuizVisible(false)
      setAnswerCorrect(true)
    } else {
      setExplanationVisibility(true)
      setAnswerCorrect(false)
      setQuizVisible(false)
    }
  }
  async function getQuestions() {
    const questionsSnapshot = await getDoc(questionsRef)
    if (questionsSnapshot.exists()) {
      setQuizesFirestore(questionsSnapshot.data())
    }
  }

  useEffect(() => {
    getQuestions()
  }, [])

  useEffect(() => {}, [currentQuestionIndex])
  return (
    <div className={styles['main-container']}>
      <video ref={videoRef} playsInline autoPlay muted loop>
        <source src="./assets/videos/particlesGray.mp4" type="video/mp4" />
      </video>
      {showQuizSelection && (
        <div className={styles['quiz-choice']}>
          <h1>Choose the Quiz</h1>
          <div className={styles['choice-buttons']}>
            <button onClick={() => choseQuiz('marsQuestions')}>Planet Mars</button>
            <button onClick={() => choseQuiz('solarQuestions')}>Solar System</button>
            <button onClick={() => choseQuiz('vehicleQuestions')}>NASA Missions</button>
          </div>
        </div>
      )}

      <div className={styles['quiz-box']}>
        {(quizVisible || explanationVisible) && (
          <h2>
            Question {currentQuestionIndex + 1}/{quizesFirestore[chosenQuiz].length}
          </h2>
        )}
        {quizVisible && currentQuestionIndex < quizesFirestore[chosenQuiz].length && (
          <div className={styles['quiz-content-box']}>
            <p>{quizesFirestore[chosenQuiz][currentQuestionIndex].question}</p>
            <div className={styles['answer-buttons']}>
              {quizesFirestore[chosenQuiz][currentQuestionIndex].answers.map((elem) => (
                <button key={elem.answer} onClick={() => answerChosen(elem.isTrue)}>
                  {elem.answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {explanationVisible && (
          <div className={styles['quiz-content-box']}>
            <p className={answerCorrect ? styles['correct'] : styles['incorrect']}>
              {quizesFirestore[chosenQuiz][currentQuestionIndex].explanation}
            </p>
            <button
              onClick={() => {
                toggleNextQuestion()
              }}
            >
              {currentQuestionIndex + 1 === quizesFirestore[chosenQuiz].length ? 'Show score' : 'Next question'}
            </button>{' '}
          </div>
        )}
      </div>

      {summaryVisible && (
        <div className={styles['summary-box']}>
          <p>
            Congrats you answered correctly {score} out of {quizesFirestore[chosenQuiz].length} questions!
          </p>
          <div className={styles['answer-buttons']}>
            <button
              onClick={() => {
                retryQuiz()
              }}
            >
              Retry
            </button>
            <Link to="/" className={styles['link-button']}>
              Go Home
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
