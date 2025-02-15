import React, { useEffect, useState } from 'react'
import AnimeCard from './AnimeCard';
import './TopAnime.css'
import Navbar from './Navbar';

const TopAnime = () => {
    const [topanimeData,setTopAnimeData] = useState([]);

    const fetchTopAnime = async (pageNumber) => {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime')
        const data = await response.json();
        setTopAnimeData(data.data);
        } catch (error) {
        console.error("Error fetching data:",error);
        } 
    };

    useEffect(() => {
        fetchTopAnime();
    },[])

    return (
        <div className={`top-anime-page`}>
            <Navbar disableSearch={true}/>
            <h1>Top Anime List</h1>
            <div className='top-anime-grid'>
                {topanimeData.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
            </div>
        </div>
    )
}

export default TopAnime;
