

const API_KEY = '0594c1d5f232fe92c7edbe005b5826ee'; 
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';


export const posterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : '/placeholder.png';

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const profileUrl = (path) =>
  path ? `${IMG_BASE}/w185${path}` : null;


const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
};


const fetchTMDB = async (endpoint, params = {}) => {
  const url = buildUrl(endpoint, params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
  return res.json();
};



export const getPopularMovies = (page = 1) =>
  fetchTMDB('/movie/popular', { page });

export const getNowPlaying = (page = 1) =>
  fetchTMDB('/movie/now_playing', { page });

export const getTopRated = (page = 1) =>
  fetchTMDB('/movie/top_rated', { page });

export const getUpcoming = (page = 1) =>
  fetchTMDB('/movie/upcoming', { page });



export const getMovieDetails = (id) =>
  fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos,similar' });



export const searchMovies = (query, page = 1) =>
  fetchTMDB('/search/movie', { query, page });



export const discoverMovies = (params = {}) =>
  fetchTMDB('/discover/movie', { sort_by: 'popularity.desc', ...params });



export const getGenres = () =>
  fetchTMDB('/genre/movie/list');
