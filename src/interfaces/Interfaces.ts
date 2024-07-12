//interfaces for director

export interface Director  {
    directorid: number,
    name: string,
    movies: Movie[],
}

export interface DirectorCardProps {
    content: Director,
}

export interface DirectorReducerState {
    directors: Director[],
    loading: boolean,
    searching: boolean,
}

export interface DirectorActionType {
    type: string,
    payload?: Director[],
}

//interfaces for movie

export interface Movie {
    movieid: number,
    title: string,
    releaseYear: number,
    genre: string,
    length: number,
    director: Director,
    reviews: Review[],
}

export interface MovieCardProps {
    content: Movie,
}

export interface MovieReducerState {
    movies: Movie[],
    loading: boolean,
    searching: boolean,
}

export interface MovieActionType {
    type: string,
    payload?: Movie[],
}

//interfaces for review

export interface Review {
    reviewid: number,
    score: number,
    comment: string,
    movie: Movie,
}

export interface ReviewCardProps {
    content: Review,
}

export interface ReviewReducerState {
    reviews: Review[],
    loading: boolean,
    searching: boolean,
}

export interface ReviewActionType {
    type: string,
    payload?: Review[],
}