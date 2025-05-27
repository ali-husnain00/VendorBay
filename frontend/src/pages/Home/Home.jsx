import React from 'react'
import "./Home.css"
import Banner from '../../components/Banner/Banner'
import SearchBar from '../../components/SearchBar/SearchBar'

const Home = () => {
  return (
    <div className='home'>
      <SearchBar/>
        <Banner/>
    </div>
  )
}

export default Home