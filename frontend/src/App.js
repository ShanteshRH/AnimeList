
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import HomePage from './HomePage';
import AnimeDetailPage from './AnimeDetailPage';
import TopAnime from './TopAnime';
import PopularAnime from './PopularAnime';
import MyAnimeList from './MyAnimeList';
import ProfilePage from './ProfilePage';
import { useState } from 'react';

function App() {
  const [searchQuery,setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <MainContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </BrowserRouter>
  );
}

function MainContent({searchQuery,setSearchQuery}) {
  const location = useLocation();

  const disableSearch = ["/", "/signup", "/profile", "/my-list", "/top-anime", "/popular-anime"].includes(location.pathname);

  return (
    <>
      <Navbar onSearch={setSearchQuery} disableSearch={disableSearch} />
      <Routes>
        <Route path='/home' element={<HomePage searchQuery={searchQuery}/>}/>
        <Route path='/' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/anime/:id' element={<AnimeDetailPage />}/>
        <Route path='/top-anime' element={<TopAnime />}/>
        <Route path='/popular-anime' element={<PopularAnime />}/>
        <Route path='/my-list' element={<MyAnimeList />}/>
        <Route path='/profile' element={<ProfilePage />}/>
      </Routes>
    </>
  );
}

export default App;
