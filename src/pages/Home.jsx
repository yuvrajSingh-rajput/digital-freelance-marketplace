import React from 'react'
import { Header, Hero, CreateJob, Footer } from '../components'

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-[#D2C1B6] min-h-screen">
      <Header />
      <Hero />
      <CreateJob />
      <Footer/>
    </div>
  )
}

export default Home