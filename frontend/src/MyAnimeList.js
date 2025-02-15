import React, { useEffect, useState } from 'react'
import './MyAnimeList.css'
import {FaEdit,FaTrash} from 'react-icons/fa';

const MyAnimeList = () => {
    const [myAnimeList,setMyAnimeList] = useState([]);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(null);
    const [selectedAnime,setSelectedAnime]=useState(null);
    const [newStatus,setNewStatus] = useState('');
    const [newScore,setNewScore] = useState('');

    const fetchMyAnimeList = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                setError('No token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/anime-list',{
                method:'GET',
                headers:{
                    'Content-type':'application/json',
                    Authorization:`Bearer ${token}`,
                },
            });

            if(!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setMyAnimeList(data.data);
        } catch (error) {
            console.error("Error fetching data:",error);
        }finally {
            setLoading(false);
        }
    }

    const updateAnime = async (animeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/anime-list',{
                method:'PUT',
                headers:{
                    'Content-type':'application/json',
                    Authorization:`Bearer ${token}`,
                },
                body: JSON.stringify({
                    animeId,
                    status:newStatus,
                    score:newScore || null,
                }),
            });

            // console.log(response);
            if(!response.ok) throw new Error('Failed to update anime');

            const data = await response.json();
            setMyAnimeList((prevList) => {
                return prevList.map((anime) =>
                    anime.animeId === animeId ? {...anime, ...data.data} : anime
                )
            });
            setSelectedAnime(null);
        } catch (error) {
            console.error('Error updating anime:',error);
            setError(error.message);
        }
    }
    
    const deleteAnime = async(animeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/anime-list',{
                method:'DELETE',
                headers:{
                    'Content-type':'application/json',
                    Authorization:`Bearer ${token}`,
                },
                body: JSON.stringify({animeId,}),
            });

            if(!response.ok) throw new Error('Failed to delete anime');

            setMyAnimeList((prevList) => 
                prevList.filter((anime) => anime.animeId !== animeId)
            );
        } catch (error) {
            console.error("Error deleting anime:",error);
            setError(error.message);
        }
    }

    useEffect(()=>{
        fetchMyAnimeList();
    },[]);

    const sortedAnimeList = [ ...myAnimeList].sort((a,b) => {
        const statusOrder = ['Watching','Completed','Plan to watch'];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });

    if (loading) {
        return <div>Loading...</div>; // Show loading message
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }

    return (
        <div className={`my-anime-page`}>
            <h1>My Anime List</h1>
            {sortedAnimeList.length === 0 ? (
                <p>No anime in your list</p>
            ) : (
                <>
                    {['Watching', 'Completed', 'Plan to watch'].map((status) => (
                        <div key={status}>
                            <h2>{status}</h2>
                            <ul>
                                {sortedAnimeList
                                    .filter((anime) => anime.status === status)
                                    .map((anime) => (
                                        <li key={anime.animeId}>
                                            <h3>{anime.title}</h3>
                                            <p>Status: {anime.status}</p>
                                            <p>Score: {anime.score}</p>
                                            <img src={anime.image} alt={anime.title} className='my-anime-img' /> 
    
                                            <div>
                                                <FaEdit 
                                                    onClick={() => {
                                                        setSelectedAnime(anime);
                                                        setNewStatus(anime.status);
                                                        setNewScore(anime.score);
                                                    }}
                                                    className='update-icon'
                                                />
                                                <FaTrash 
                                                    onClick={() => deleteAnime(anime.animeId)}
                                                    className='del-icon'
                                                />
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </>
            )}
            {selectedAnime && (
                <div className='update-form'>
                    <h2>Update Anime</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateAnime(selectedAnime.animeId);
                        }}
                    >
                        <label>
                            Status:
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="Watching">Watching</option>
                                <option value="Completed">Completed</option>
                                <option value="Plan to watch">Plan to watch</option>
                            </select>
                        </label>
                        <label>
                            Score:
                            <input
                                type="number"
                                value={newScore ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewScore(value === '' ? null : Number(value));
                                }}
                                min="1"
                                max="10"
                                required={false}
                            />
                        </label>
                        <button type='submit'>Update</button>
                        <button type='button' onClick={() => setSelectedAnime(null)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
    
}

export default MyAnimeList
