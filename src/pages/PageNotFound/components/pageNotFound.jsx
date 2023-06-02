import { React } from 'react'
import style from '../styles/pageNotFound.module.scss'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className={style.pageNotFound}>
      <h2>Page not found</h2>
      <p>Address you entered does not lead anywhere.</p>
      <Link to="/">Go Home</Link>
    </div>
  )
}
