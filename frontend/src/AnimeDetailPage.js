import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './AnimeDetailPage.css'
const AnimeDetailPage = () => {
    const {id} = useParams();
    const [anime,setAnime] = useState(null);
    const [message,setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [score, setScore] = useState('');
    const [status,setStatus] = useState('');
    
    const fetchAnimeDetails = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const data = await response.json();
            setAnime(data.data);
        } catch (error) {
            console.error('Error fetching anime details:',error);
        }
    }

    useEffect(() => {
        fetchAnimeDetails();
    },[id]);

    const handleAddToList = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/anime-list',{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    Authorization:`Bearer ${token}`,
                },
                body: JSON.stringify({
                    animeId: anime.mal_id,
                    title: anime.title_english || anime.title,
                    image: anime.images.jpg.large_image_url,
                    status,
                    score:parseInt(score),
                }),
            });

            const data = await response.json();

            if(response.ok){
                setMessage(data.message);
            }else{
                setMessage(data.message || 'Error adding anime to list');
            }
        } catch (error) {
            console.error('Error adding anime to list:',error);
            setMessage('Failed to add anime to the list');
        } finally {
            setShowModal(false);
        }
    }

    if(!anime) return <p>Loading...</p>;

    return (
        <div className={`anime-detail-page`}>
            <div className="anime-header">
                <img src={anime.images.jpg.large_image_url} alt={anime.title} className="anime-detail-image" />
            </div>
            <h1>{anime.title_english}</h1>
            <p><strong>Year:</strong> {anime.year}</p>
            <p><strong>Rating:</strong> {anime.rating}</p>
            {anime.episodes && (
                <p>
                    <strong>No. of Episodes:</strong> {anime.episodes}
                </p>
            )}
            <p><strong>Description:</strong> {anime.synopsis}</p>
            <p><strong>Status:</strong> {anime.status}</p>
            <p><strong>Rank:</strong> {anime.rank}</p>
            <p><strong>Popularity:</strong> {anime.popularity}</p>

            <h3>Genres</h3>
            <p>{anime.genres.map(genre => genre.name).join(', ')}</p>
        
            <button className='add-to-list-button' onClick={() => setShowModal(true)}>
                Add to My List
            </button>
            {message && <p className='message'>{message}</p>}

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Add to My List</h2>
                        <label >
                            Score(1-10):
                            <input 
                                type="number"
                                min="1"
                                max="10"
                                value={score}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '') {
                                        setScore('N/A'); // Default to N/A when the input is cleared
                                    } else {
                                        setScore(Number(value)); // Convert input to number if not empty
                                    }
                                }}
                            />
                        </label>
                        <label >
                            Status:
                            <select value={status} onChange={(e) => setStatus(e.target.value)} >
                                <option value="">Select Status</option>
                                <option value="Watching">Watching</option>
                                <option value="Completed">Completed</option>
                                <option value="Plan to watch">Plan to watch</option>
                            </select>
                        </label>
                        <div className='modal-actions'>
                            <button onClick={handleAddToList}>Add</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnimeDetailPage
