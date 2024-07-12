import { useEffect, useRef, useReducer, ReactElement, ChangeEvent, Key } from "react"
import MovieCard from "./MovieCard";
import '../css/tab.css'
import { URL } from "../constants/Constants";
import Picture from "../assets/Popcorn.jpg";
import { Button } from '@mui/material';
import { Movie, MovieActionType, MovieReducerState } from "../interfaces/Interfaces";

const MovieTab = (): ReactElement => {

  const useReducerActions = {
    updateMovies: "updateMovies",
    setLoadingTrue: 'setLoadingTrue',
    setLoadingFalse: 'setLoadingFalse',
    toggleSearching: 'toggleSearching',
  }

  const initialMovieState: MovieReducerState = {
    movies: [],
    loading: true,
    searching: false,
  }

  const reducer = (state: MovieReducerState, action: MovieActionType): MovieReducerState => {
    switch (action.type) {
      case useReducerActions.updateMovies:
        return { ...state, movies: action.payload ?? [] };
      case useReducerActions.setLoadingTrue:
        return { ...state, loading: true };
      case useReducerActions.setLoadingFalse:
        return { ...state, loading: false };
      case useReducerActions.toggleSearching:
        return { ...state, searching: !state.searching };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialMovieState);
  const searchDropdownRef = useRef<HTMLSelectElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const fetchMovies = async () => {
    dispatch({ type: useReducerActions.setLoadingTrue });

    const option: string = searchDropdownRef?.current?.value as string;
    const keyword: string = inputFieldRef?.current?.value as string;

    if (keyword.trim() === "") {
      try {
        const response = await fetch(URL + "/api/movies");
        const data: Movie[] = await response.json();
        dispatch({ type: useReducerActions.updateMovies, payload: data });
        dispatch({ type: useReducerActions.setLoadingFalse });
      }
      catch (error) {
        console.error(error);
      }
    }

    else {
      try {
        dispatch({ type: useReducerActions.toggleSearching });
        const response = await fetch(URL + `/api/movies/findBy${option}/${keyword}`);
        const data: Movie[] = await response.json();
        dispatch({ type: useReducerActions.updateMovies, payload: data.sort((a: Movie, b: Movie) => a.title.localeCompare(b.title)) });
        dispatch({ type: useReducerActions.setLoadingFalse });
      }
      catch (error) {
        console.error(error);
      }
    }
  }

  const undoSearch = async () => {
    try {
      dispatch({ type: useReducerActions.setLoadingTrue });
      dispatch({ type: useReducerActions.toggleSearching });
      const response = await fetch(URL + "/api/movies");
      const data: Movie[] = await response.json();
      dispatch({ type: useReducerActions.updateMovies, payload: data });
      dispatch({ type: useReducerActions.setLoadingFalse });
    }

    catch (error) {
      console.error(error);
    }
  }

  const sortMovies = (event: ChangeEvent<HTMLSelectElement>): void => {
    const toBeSortedMovies: Movie[] = [...state.movies];

    switch (event.target.value) {
      case "A-Z":
        dispatch({ type: useReducerActions.updateMovies, payload: toBeSortedMovies.sort((a: Movie, b: Movie) => a.title.localeCompare(b.title)) });
        break;
      case "Z-A":
        dispatch({ type: useReducerActions.updateMovies, payload: toBeSortedMovies.sort((a: Movie, b: Movie) => b.title.localeCompare(a.title)) });
        break;
      case "Longest":
        dispatch({ type: useReducerActions.updateMovies, payload: toBeSortedMovies.sort((a: Movie, b: Movie) => b.length - a.length) });
        break;
      case "Shortest":
        dispatch({ type: useReducerActions.updateMovies, payload: toBeSortedMovies.sort((a: Movie, b: Movie) => a.length - b.length) });
        break;
      case "Most recent":
        dispatch({ type: useReducerActions.updateMovies, payload: toBeSortedMovies.sort((a: Movie, b: Movie) => b.releaseYear - a.releaseYear) });
        break;
      case "Most old":
        dispatch({ type: useReducerActions.updateMovies, payload: toBeSortedMovies.sort((a: Movie, b: Movie) => a.releaseYear - b.releaseYear) });
        break;
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

  return (

    <>

      <header>
        <h1>Movies I have Watched</h1>
        <img src={Picture} />
      </header>

      <div className="searchBar">

        <div>
          <label htmlFor="sortDropdown">Sort by:</label>

          <select id="sortDropdown" onChange={sortMovies} defaultValue={"A-Z"}>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="Longest">Longest</option>
            <option value="Shortest">Shortest</option>
            <option value="Most recent">Most recent</option>
            <option value="Most old">Most old</option>
          </select>
        </div>

        <div>
          <label htmlFor="searchDropdown">Search by:</label>

          <select id="searchDropdown" ref={searchDropdownRef} defaultValue={"genre"}>
            <option value="Genre">Genre</option>
            <option value="Title">Title</option>
          </select>

          <input type="text" placeholder="Enter keyword" ref={inputFieldRef} />
          <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" onClick={fetchMovies}>Search</Button>
        </div>

        {state.searching &&
          <div className="undo">
            <span>Searching with a keyword</span>
            <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" onClick={undoSearch}>Undo</Button>
          </div>
        }

      </div>

      {state.loading ? <p className="infoParagraph">Loading Movies...</p> :
        <div className="contentContainer">
          {state.movies.map((movie: Movie, index: Key) =>
            <MovieCard key={index} content={movie} />
          )}
        </div>
      }

    </>

  )

}

export default MovieTab