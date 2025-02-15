
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
// import Navbar from './Navbar';
import HomePage from './HomePage';
import AnimeDetailPage from './AnimeDetailPage';
import TopAnime from './TopAnime';
import PopularAnime from './PopularAnime';
import MyAnimeList from './MyAnimeList';
import ProfilePage from './ProfilePage';

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/home' element={<HomePage />}/>
        <Route path='/' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/anime/:id' element={<AnimeDetailPage />}/>
        <Route path='/top-anime' element={<TopAnime />}/>
        <Route path='/popular-anime' element={<PopularAnime />}/>
        <Route path='/my-list' element={<MyAnimeList />}/>
        <Route path='/profile' element={<ProfilePage />}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
