import React, { useEffect, useRef, useState } from 'react'
import AnimeCard from './AnimeCard';
import './HomePage.css';
import Navbar from './Navbar';
import InfiniteScroll from 'react-infinite-scroll-component'

const HomePage = () => {
  const [animeData,setAnimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults,setTotalResults] = useState(0);
  const [query, setQuery] = useState('');

  const fetchAnime = async (searchQuery='',reset=false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${searchQuery}&page=${reset ? 1 : page}`
      );
      const data = await response.json();
      setAnimeData((prev) =>
        reset ? data.data || [] : [...prev, ...(data.data || [])]
      );
      setTotalResults(data.pagination?.items?.total || 0);
      if (reset) setPage(2);
      else setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:",error);
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout=setTimeout(() => func(...args,delay));
    };
  };

  const debouncedSearch = useRef(debounce((query) => setQuery(query),300)).current;

  useEffect(() => {
    fetchAnime(query,true);
  },[query])

  const fetchMoreAnime = async () => {
    // let url=`https://api.jikan.moe/v4/anime?q={query}&page=${page+1}`;
    // setPage(page+1);
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // setAnimeData(animeData.concat(parsedData.data));
    // setTotalResults(parsedData.total);
    fetchAnime(query);
  }

  return (
    <div className={`home-page `}>
      <Navbar onSearch={(searchQuery) => debouncedSearch(searchQuery)} disableSearch={false}/>
      {loading && <p className='loading'>Loading ...</p>}
      <InfiniteScroll
        dataLength={animeData.length}
        next={fetchMoreAnime}
        hasMore={animeData.length!==totalResults}
      >
        <h1>Anime List</h1>
        <div className='anime-grid'>
          {animeData.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default HomePage
