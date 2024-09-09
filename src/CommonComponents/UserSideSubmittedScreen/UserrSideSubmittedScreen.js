import React from 'react'
import './UserSideSubmittedScreen.css'
import Lottie from 'lottie-react'
import thumb from '../../CustomerFeedback/Assets/thumbs_Up.json'

const UserrSideSubmittedScreen = () => {
  return (
    <section className="userSubmittedMainDiv">
    <div className="animationwrapper">
    <Lottie animationData={thumb} className='userIcon'/>
    <h2 className='userContent'>Form Already Submitted!</h2>
    </div>
  </section>
  )
}

export default UserrSideSubmittedScreen