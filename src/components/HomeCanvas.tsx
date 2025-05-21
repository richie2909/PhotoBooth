import React from 'react'
import Navigation from "./Navigation"
import Landing from './Landing'
import Hero from './Hero'

function HomeCanvas() {
  return (
    <div className='relative  '>
    <div className='z-10 '>
    <Navigation />
    </div>
   
  
      <div className='-z-10'>
      <Hero />
    <Landing />
      </div>
   
 
      
    </div>
  )
}

export default HomeCanvas