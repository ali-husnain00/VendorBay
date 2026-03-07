import React from 'react'
import "./Home.css"
import Banner from '../../components/Banner/Banner'
import SearchBar from '../../components/SearchBar/SearchBar'
import LatestProducts from '../../components/LatestProducts/LatestProducts'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'

const Home = () => {
  return (
    <main className="home" aria-label="Home">
      <SearchBar/>
        <Banner/>
        <LatestProducts/>
        <FeaturedProducts/>
    </main>
  )
}

export default Home