//interfaces for director

export interface Director  {
    directorid: Number,
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
    movieid: Number,
    title: string,
    releaseYear: Number,
    genre: string,
    length: Number,
    director: Director,
    reviews: Review[],
}

//interfaces for review

export interface Review {
    reviewid: Number,
    score: Number,
    comment: string,
    movie: Movie,
}
