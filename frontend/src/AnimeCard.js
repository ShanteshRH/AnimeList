import React from 'react'
import './AnimeCard.css';
import { Link } from 'react-router-dom';

const AnimeCard = ({anime}) => {
  return (
    <div className='anime-card'>
        <Link to={`/anime/${anime.mal_id}`}>
            <img src={anime.images.jpg.image_url} alt={anime.title_english} className='anime-card-image'/>
            <h3>{anime.title_english || anime.title}</h3>
            <p className='anime-card-description'>
                {anime.synopsis?anime.synopsis.slice(0,100) + '...' : 'No description available.'}
            </p>
            <p className='anime-card-rating'>Rating: {anime.score || 'N/A'}</p>
        </Link>
    </div>
  )
}

export default AnimeCard
