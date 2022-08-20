/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 *
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import './assets/styles.css'
import { useEffect, useState } from 'react'

export default function Exercise02() {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('alls')
  const [movies, setMovies] = useState([])
  const [fetchCount, setFetchCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState('desc')

  useEffect(() => {
    const getGenres = async () => {
      try {
        const res = await fetch('http://localhost:3001/genres')
        const json = await res.json()
        setGenres(json.sort())
      } catch (error) {
        console.log('Run yarn movie-api for fake api')
      }
    }
    getGenres()
  }, [])

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true)
      setFetchCount(fetchCount + 1)
      try {
        let url = `http://localhost:3001/movies?_page=1&_limit=50&_sort=year&_order=${order}`
        if (genre !== 'alls') {
          url = `http://localhost:3001/movies?genres_like=${genre}&_sort=year&_order=${order}`
        }
        const res = await fetch(url)
        const json = await res.json()
        setMovies(json)
        setLoading(false)
      } catch (error) {
        console.log('Run yarn movie-api for fake api')
      }
    }
    if (genre && genre !== '') {
      getMovies()
    }
  }, [genre, order])

  const onChangeGenre = evt => {
    setGenre(evt.target.value)
  }

  const orderMovies = () => {
    if (order === 'desc') {
      setOrder('asc')
    } else {
      setOrder('desc')
    }
  }

  return (
    <section className="movie-library">
      <h1 className="movie-library__title">Movie Library</h1>
      <div className="movie-library__actions">
        <select name="genre" placeholder="Search by genre..." onChange={onChangeGenre}>
          <option value="alls">Alls</option>
          {genres.length > 0 &&
            genres.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
        </select>
        <button onClick={orderMovies}>Year {order === 'asc' ? 'Ascending' : 'Descending'}</button>
      </div>
      {loading ? (
        <div className="movie-library__loading">
          <p>Loading...</p>
          <p>Fetched {fetchCount} times</p>
        </div>
      ) : (
        <ul className="movie-library__list">
          {movies.map(movie => (
            <li key={movie.id}>
              <div className="movie-library__card">
                <img src={movie.posterUrl} alt={movie.title} />
                <ul>
                  <li className="movie-library__card-title">{movie.title}</li>
                  <li className="movie-library__card-genres">{movie.genres.join(', ')}</li>
                  <li className="movie-library__card-year">{movie.year}</li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
