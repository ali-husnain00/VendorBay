import React from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import AllProducts from './pages/AllProducts/AllProducts';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';

const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element = {<Home/>} />
      <Route path='/about' element = {<About/>} />
      <Route path='/contact' element = {<Contact/>} />
      <Route path='/cart' element = {<Cart/>} />
      <Route path='/login' element = {<Login/>} />
      <Route path='/register' element = {<Register/>} />
      <Route path='/products' element = {<AllProducts/>} />
      <Route path='/profile' element = {<Profile/>} />
      <Route path='/dashboard' element = {<Dashboard/>} />
    </Routes>
    </>
  )
}

export default App