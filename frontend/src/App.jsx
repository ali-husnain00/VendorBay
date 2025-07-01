import React, { Suspense, lazy, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Navbar from './components/Navbar/Navbar';
import Loading from './components/Loading/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer/Footer';
import { context } from './components/Context/Context';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const AllProducts = lazy(() => import('./pages/AllProducts/AllProducts'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const BecomeSeller = lazy(() => import('./pages/BecomeSeller/BecomeSeller'));
const Notifications = lazy(() => import('./pages/Notifications/Notifications'));
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const SearchResults = lazy(() => import('./pages/SearchResults/SearchResults'));
const AdminPanel = lazy(() =>import('./pages/AdminPanel/AdminPanel'))

const App = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/dashboard" || location.pathname === "/admin/dashboard";

  return (
    <>
      {!hideLayout && <Navbar />}
      <ToastContainer />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/becomeSeller' element={<BecomeSeller />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/product/details/:id' element = {<ProductDetails/>} />
          <Route path='/checkout' element = {<Checkout/>} />
          <Route path='/searchResults' element = {<SearchResults/>} />
          <Route path='/admin/dashboard' element = {<AdminPanel/>} />
        </Routes>
      </Suspense>
      <Footer/>
    </>
  );
}

export default App;
