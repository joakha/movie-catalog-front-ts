import { useEffect, useRef, useReducer, ReactElement, ChangeEvent, Key } from "react"
import ReviewCard from "./ReviewCard";
import '../css/tab.css'
import { URL } from "../constants/Constants";
import Picture from "../assets/Review.jpg";
import { Button } from '@mui/material';
import { Review, ReviewActionType, ReviewReducerState } from "../interfaces/Interfaces";

const ReviewTab = (): ReactElement => {

  const useReducerActions = {
    updateReviews: "updateReviews",
    setLoadingTrue: 'setLoadingTrue',
    setLoadingFalse: 'setLoadingFalse',
    toggleSearching: 'toggleSearching',
  }

  const initialReviewState: ReviewReducerState = {
    reviews: [],
    loading: true,
    searching: false
  }

  const reducer = (state: ReviewReducerState, action: ReviewActionType): ReviewReducerState => {
    switch (action.type) {
      case useReducerActions.updateReviews:
        return { ...state, reviews: action.payload ?? [] };
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

  const [state, dispatch] = useReducer(reducer, initialReviewState );
  const searchDropdownRef = useRef<HTMLSelectElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const fetchReviews = async () => {
    dispatch({ type: useReducerActions.setLoadingTrue });

    const option: string = searchDropdownRef?.current?.value as string;
    const keyword: string = inputFieldRef?.current?.value as string;

    if (keyword.trim() === "") {
      try {
        const response = await fetch(URL + "/api/reviews");
        const data: Review[] = await response.json();
        dispatch({ type: useReducerActions.updateReviews, payload: data });
        dispatch({ type: useReducerActions.setLoadingFalse });
      }
      catch (error) {
        console.error(error);
      }
    }

    else {
      try {
        dispatch({ type: useReducerActions.toggleSearching });
        const response = await fetch(URL + `/api/reviews/findBy${option}/${keyword}`);
        const data: Review[] = await response.json();
        dispatch({ type: useReducerActions.updateReviews, payload: data.sort((a: Review, b: Review) => b.score - a.score) });
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
      const response = await fetch(URL + "/api/reviews");
      const data: Review[] = await response.json();
      dispatch({ type: useReducerActions.updateReviews, payload: data });
      dispatch({ type: useReducerActions.setLoadingFalse });
    }
    catch (error) {
      console.error(error);
    }
  }

  const sortReviews = (event: ChangeEvent<HTMLSelectElement>): void => {
    const toBeSortedReviews: Review[] = [...state.reviews];

    switch (event.target.value) {
      case "Highest Score":
        dispatch({ type: useReducerActions.updateReviews, payload: toBeSortedReviews.sort((a: Review, b: Review) => b.score - a.score) });
        break;
      case "Lowest Score":
        dispatch({ type: useReducerActions.updateReviews, payload: toBeSortedReviews.sort((a: Review, b: Review) => a.score - b.score) });
        break;
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [])

  return (

    <>

      <header>
        <h1>My Movie Reviews</h1>
        <img src={Picture} />
      </header>

      <div className="searchBar">

        <div>
          <label htmlFor="sortDropdown">Sort by:</label>

          <select id="sortDropdown" onChange={sortReviews} defaultValue={"Highest Score"}>
            <option value="Highest Score">Highest Score</option>
            <option value="Lowest Score">Lowest Score</option>
          </select>
        </div>

        <div>
          <label htmlFor="searchDropdown">Search by:</label>

          <select id="searchDropdown" ref={searchDropdownRef} defaultValue={"Score"}>
            <option value="Score">Score</option>
          </select>

          <input type="text" placeholder="Enter keyword..." ref={inputFieldRef} />
          <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" onClick={fetchReviews}>Search</Button>
        </div>

        {state.searching &&
          <div className="undo">
            <span>Searching with a keyword</span>
            <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" onClick={undoSearch}>Undo</Button>
          </div>
        }
      </div>

      {state.loading ? <p className="infoParagraph">Loading Reviews...</p> :
        <div className="contentContainer">
          {state.reviews.map((review: Review, index: Key) =>
            <ReviewCard key={index} content={review} />
          )}
        </div>
      }

    </>

  )

}

export default ReviewTab