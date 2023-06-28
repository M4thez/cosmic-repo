import style from './LoaderDots.module.scss'

// Loading element inside the canvas
export default function LoaderDots(props) {
  return (
    <div className={style.loading}>
      <h1>{props.title}</h1>
      <div className={style.loadingDots}>
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    </div>
  )
}

LoaderDots.defaultProps = {
  title: 'Webpage',
}