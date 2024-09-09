
import Lottie from 'lottie-react'
import './NoMatch.css'
import React from 'react'
import notFoundAnimation from '../../src/CustomerFeedback/Assets/lottie2.json'

const NoMatch = () => {

  const style = {
    width:"100vw",
    height:"100%",
    margin:0,
    padding:0,
  }


  return (
    <section className="nomatchwrapper">
      <div className="animationwrapper">
      <Lottie animationData={notFoundAnimation} style={style} />
      <h2 className='acces' style={{marginTop:"-7%"}}>You Do Not Have Access</h2>
      </div>
    </section>
  )
}

export default NoMatch
