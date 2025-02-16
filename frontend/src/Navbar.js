import React, { useEffect, useState } from 'react'
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';


const Navbar = ({onSearch,disableSearch}) => {

    const navigate = useNavigate();
    const [dropdownVisible,setDropdownVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    
    useEffect(() => {
        const storedUsername = localStorage.getItem('username'); 
        if (storedUsername) {
            setUsername(storedUsername); 
        }

        const storedProfilePicture = localStorage.getItem('profilePicture');
        if(storedProfilePicture){
            setProfilePicture(storedProfilePicture);
        }
    }, []);

    const fetchTopAnime = () => {
        navigate("/top-anime");
    }

    const fetchPopularAnime = () => {
        navigate("/popular-anime");
    }
    
    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePicture");
        navigate("/");
    }

    const handleChange = (e) => {
        setSearchInput(e.target.value); 
    }

    const handleSearchClick = () => {
        onSearch(searchInput); // Only update search when button is clicked
    };

    const handleHomeClick = () => {
        setSearchInput("");
        onSearch("");
        navigate("/home");
    }

    return (
        <nav className={`navbar`}>
            <div className='navbar-brand'>
                <button className='home-icon' onClick={handleHomeClick}>
                    <FaHome size={30} color="white"/>
                </button>
                <h1>Anilist</h1>
            </div>
            <div className='navbar-search'>
            {!disableSearch && (
                <>
                    <input 
                        type="text"
                        placeholder='Search Anime...'
                        className='search-input'
                        value={searchInput}
                        onChange={handleChange}
                    />
                    <button 
                        className='search-button' 
                        onClick={handleSearchClick}
                    >
                        Search
                    </button>
                </>
            )}
            </div>
            <div className='navbar-links'>
                <button onClick={fetchPopularAnime} className='navbar-link'>Popular Animes</button>
                <button onClick={fetchTopAnime} className='navbar-link'>Top Animes</button>
                <div className='profile' onClick={handleDropdownToggle}>
                    <span className='username'> {username}</span>
                    <img 
                        src={profilePicture || 'http://localhost:5000/uploads/default.jpg'}
                        alt="Profile"
                        className='picture'
                    />
                </div>
                {dropdownVisible && (
                    <div>
                        <Link to="/profile" className='dropdown-item'>Profile</Link>
                        <Link to="/my-list" className='dropdown-item' >Anime List</Link>
                        <button className='dropdown-item logout' onClick={handleLogout}>Logout</button> 
                    </div>
                )}
            </div>
        </nav>
        
  )
}

export default Navbar
