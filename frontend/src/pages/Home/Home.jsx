import React from 'react'
import "./Home.css"
import Banner from '../../components/Banner/Banner'
import SearchBar from '../../components/SearchBar/SearchBar'
import LatestProducts from '../../components/LatestProducts/LatestProducts'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'
import BecomeSellerBanner from '../../components/BecomeSellerBanner/BecomeSellerBanner'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div className='home'>
      <SearchBar/>
        <Banner/>
        <LatestProducts/>
        <FeaturedProducts/>
        <BecomeSellerBanner/>
    </div>
  )
}

export default Home