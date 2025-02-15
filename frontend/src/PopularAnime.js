import React, { useEffect, useState } from 'react'
import AnimeCard from './AnimeCard';
import Navbar from './Navbar';
import './PopularAnime.css'

const PopularAnime = () => {
    const [popularanimeData,setPopularAnimeData] = useState([]);

    const fetchPopularAnime = async () => {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity')
        const data = await response.json();
        setPopularAnimeData(data.data);
        } catch (error) {
        console.error("Error fetching data:",error);
        } 
    };

    useEffect(() => {
        fetchPopularAnime();
    },[])
    
    return (
        <div className='popular-anime-page'>
            <Navbar disableSearch={true}/>
            <h1>Popular Anime List</h1>
            <div className='popular-anime-grid'>
                {popularanimeData.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
            </div>
        </div>
    )
}

export default PopularAnime
