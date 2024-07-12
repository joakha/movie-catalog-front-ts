import { useEffect, useRef, useReducer, ChangeEvent, Key, ReactElement } from "react"
import DirectorCard from "./DirectorCard";
import '../css/tab.css'
import { URL } from "../constants/Constants";
import Picture from "../assets/Director.png";
import { Button } from '@mui/material';
import { Director, DirectorReducerState, DirectorActionType } from "../interfaces/Interfaces";

const DirectorTab = (): ReactElement => {

  const useReducerActions = {
    updateDirectors: "updateDirectors",
    setLoadingTrue: 'setLoadingTrue',
    setLoadingFalse: 'setLoadingFalse',
    toggleSearching: 'toggleSearching',
  }

  const initialDirectorState: DirectorReducerState = {
    directors: [],
    loading: true,
    searching: false,
  }

  const reducer = (state: DirectorReducerState, action: DirectorActionType): DirectorReducerState => {
    switch (action.type) {
      case useReducerActions.updateDirectors:
        return { ...state, directors: action.payload ?? [] };
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

  const [state, dispatch] = useReducer(reducer, initialDirectorState);
  const searchDropdownRef = useRef<HTMLSelectElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const fetchDirectors = async () => {
    dispatch({ type: useReducerActions.setLoadingTrue });

    const option: string = searchDropdownRef?.current?.value as string;
    const keyword: string = inputFieldRef?.current?.value as string;

    if (keyword.trim() === "") {
      try {
        const response = await fetch(URL + "/api/directors");
        const data: Director[] = await response.json();
        dispatch({ type: useReducerActions.updateDirectors, payload: data });
        dispatch({ type: useReducerActions.setLoadingFalse });
      }
      catch (error) {
        console.error(error);
      }
    }

    else {
      try {
        dispatch({ type: useReducerActions.toggleSearching });
        const response = await fetch(URL + `/api/directors/findBy${option}/${keyword}`);
        const data: Director[] = await response.json();
        dispatch({ type: useReducerActions.updateDirectors, payload: data.sort((a: Director, b: Director) => a.name.localeCompare(b.name)) });
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
      const response = await fetch(URL + "/api/directors");
      const data: Director[] = await response.json();
      dispatch({ type: useReducerActions.updateDirectors, payload: data });
      dispatch({ type: useReducerActions.setLoadingFalse });
    }
    catch (error) {
      console.error(error);
    }
  }

  const sortDirectors = (event: ChangeEvent<HTMLSelectElement>): void => {
    const toBeSortedDirectors: Director[] = [...state.directors];

    switch (event.target.value) {
      case "A-Z":
        dispatch({ type: useReducerActions.updateDirectors, payload: toBeSortedDirectors.sort((a: Director, b: Director) => a.name.localeCompare(b.name)) });
        break;
      case "Z-A":
        dispatch({ type: useReducerActions.updateDirectors, payload: toBeSortedDirectors.sort((a: Director, b: Director) => b.name.localeCompare(a.name)) });
        break;
    }
  }

  useEffect(() => {
    fetchDirectors();
  }, [])

  return (

    <>

      <header>
        <h1>Movie Directors</h1>
        <img src={Picture} />
      </header>

      <div className="searchBar">

        <div>
          <label htmlFor="sortDropdown">Sort by:</label>

          <select id="sortDropdown" onChange={sortDirectors} defaultValue={"A-Z"}>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>
        </div>

        <div>
          <label htmlFor="searchDropdown">Search by:</label>

          <select id="searchDropdown" ref={searchDropdownRef}>
            <option value="Name">Name</option>
          </select>

          <input type="text" placeholder="Enter keyword..." ref={inputFieldRef} />
          <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" onClick={fetchDirectors}>Search</Button>
        </div>

        {state.searching &&
          <div className="undo">
            <span>Searching with a keyword</span>
            <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" onClick={undoSearch}>Undo</Button>
          </div>
        }
      </div>

      {state.loading ? <p className="infoParagraph">Loading Directors...</p> :
        <div className="contentContainer">
          {state.directors.map((director: Director, index: Key) =>
            <DirectorCard key={index} content={director} />
          )}
        </div>
      }

    </>

  )

}

export default DirectorTab