# 🎬 CineScope — Movie Discovery Website

A fully functional React movie discovery website built with **React 18**, **React Router v6**, and the **TMDB API**.

---

## 🚀 Quick Setup

### 1. Get a TMDB API Key (Free)
1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/) and create a free account
2. Go to **Settings → API** and request an API key
3. Copy your API key (it looks like: `a1b2c3d4e5f6...`)

### 2. Add Your API Key
Open `src/api/tmdb.js` and replace line 13:
```js
const API_KEY = 'YOUR_API_KEY_HERE'; // ← Replace this
```
with your actual key:
```js
const API_KEY = 'a1b2c3d4e5f6...'; // ← Your real key
```

### 3. Install & Run
```bash
npm install
npm start
```
The app will open at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
src/
├── api/
│   └── tmdb.js          ← All TMDB API functions
├── components/
│   ├── Header.jsx        ← Top navigation bar
│   ├── Footer.jsx        ← Bottom footer
│   ├── MovieCard.jsx     ← Reusable movie card
│   ├── Loader.jsx        ← Loading spinner
│   ├── RatingStars.jsx   ← 5-star rating component
│   └── Toast.jsx         ← Pop-up notification
├── pages/
│   ├── Home.jsx          ← Home page with hero + sections
│   ├── Movies.jsx        ← Browse all movies + filters
│   ├── MovieDetails.jsx  ← Full movie info page
│   ├── Search.jsx        ← Search movies by title
│   ├── Watchlist.jsx     ← Your saved movies
│   ├── Ratings.jsx       ← Your rated movies
│   ├── Admin.jsx         ← Stats dashboard
│   └── NotFound.jsx      ← 404 page
├── utils/
│   └── storage.js        ← localStorage helpers
├── App.js                ← Routing setup
├── index.js              ← Entry point
└── index.css             ← All styles
```

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🏠 Home | Hero, Now Playing, Popular, Top Rated, Upcoming |
| 🎬 Movies | Browse + filter by Genre, Year, Rating, Sort |
| 🔍 Search | Find any movie in TMDB |
| 🎥 Details | Full info, trailer, cast, similar movies |
| 📋 Watchlist | Save movies, mark as watched (localStorage) |
| ⭐ Ratings | Rate movies 1–10, view your history |
| ⚙️ Admin | Stats, progress, activity feed |

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **React Router v6** — Client-side routing
- **TMDB API** — Movie data
- **localStorage** — Watchlist + ratings persistence
- **CSS Variables** — Dark theme styling

---

## 📝 Notes for Students

- All API calls are in `src/api/tmdb.js` — easy to find and modify
- localStorage helpers are in `src/utils/storage.js` — all in one place
- Each component and page has comments explaining what it does
- Error handling is simple: just shows an error message
- No external state management (Redux etc.) — just `useState` and `useEffect`

---

## 🔑 API Key Security

> ⚠️ **For a student/learning project**, the API key is stored directly in the code.  
> In a **production** app, you should use a `.env` file:
> ```
> REACT_APP_TMDB_KEY=your_key_here
> ```
> And access it as `process.env.REACT_APP_TMDB_KEY`

---

Built with ❤️ for learning React.
