import React, { useState } from 'react';
import { Routes, Route ,useLocation } from 'react-router-dom';
import Header from './Components/Partials/Header'
import Footer from './Components/Partials/Footer'
import Home from './Components/Body/Home'
import TypeFilm from './Components/Body/typeFlim'
import FilmDetail from './Components/Body/FilmDetail'
import WatchFilm from './Components/Body/WatchFilm'
import SearchResult from './Components/Body/SearchResult'
import GenreFilm from './Components/Body/GenreFilm'
import Login from './Components/Body/Login'
import NoticeVerify from './Components/Body/NoticeVerify'
import Register from './Components/Body/Register'
import VerifyEmail from './Ultil/Account/VerifyEmail';
import SuccessNotice from './Components/Body/SuccesNotive';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import Profile from './Components/Body/Profile';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isNoticeVerify = location.pathname === '/verify';
  const isSuccessVerify = location.pathname === '/successnotice';

  const [userEmail, setUserEmail] = useState(null);
  
  return (
    <div className="App">
      <ToastContainer />
      {!isLoginPage && !isRegisterPage && !isNoticeVerify && !isSuccessVerify &&(
        <div id="header-container">
          <Header/>
        </div>
      )}
      
      <div id="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<NoticeVerify />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/successnotice" element={<SuccessNotice />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/danh-sach/:slug" element={<TypeFilm />} />
          <Route path="/filmDetail/:slug" element={<FilmDetail />} />
          <Route path="/watchFilm/:slug" element={<WatchFilm />} />
          <Route path="/searchFilm/:slug" element={<SearchResult />} />
          <Route path="/genre/:slug" element={<GenreFilm />} />
        </Routes>
      </div>
      {
        !isLoginPage && !isRegisterPage && !isNoticeVerify && !isSuccessVerify && (
          <div id="footer-container">
            <Footer />
          </div>
        )
      }
      
    </div>
  );
}

export default App;