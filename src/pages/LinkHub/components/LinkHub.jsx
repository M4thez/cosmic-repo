import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/LinkHub.module.scss'

export function LinkHub() {
  return (
    <main className={styles['main-container']}>
      <div className={styles['homepage-info']}>
        <h1>Homepage</h1>
        <p>
          <i>Cosmic</i> - educational website for space exploration 
        </p>
      </div>
      <div className={styles['image-gallery']}>
        <LinkImage imgSrc="./assets/link_hub/mars.jpg" linkTo="/mars" linkDescription="Learn about Mars" />
        <LinkImage imgSrc="./assets/link_hub/solar.jpg" linkTo="/solar" linkDescription="Learn about Solar System" />
        <LinkImage imgSrc="./assets/link_hub/stage.jpg" linkTo="/stage" linkDescription="Learn about NASA's inventions" />
        <LinkImage imgSrc="./assets/link_hub/apod.jpg" linkTo="/apod" linkDescription="See interesting astronomy pictures" />
        <LinkImage imgSrc="./assets/link_hub/logo.jpg" linkTo="/quiz" linkDescription="Check your knowledge with our quizzes" />
      </div>
    </main>
  )
}

function LinkImage(props) {
  return (
    <Link className={styles['link-image-item']} to={props.linkTo}>
      <img src={props.imgSrc} />
      <div className={styles['image-text-overlay']}>{props.linkDescription}</div>
    </Link>
  )
}
