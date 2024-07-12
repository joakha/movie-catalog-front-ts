import { Key, ReactElement } from 'react'
import '../css/infocard.css'
import { DirectorCardProps, Movie } from '../interfaces/Interfaces'

const DirectorCard = ({ content }: DirectorCardProps): ReactElement => {
    return (
        <div className='card'>
            <h2 className='card-title'>{content.name}</h2>

            <p id='movielistHeader'>Movies:</p>

            {content.movies.map((movie: Movie, index: Key) => {
                return (
                    <p key={index}>{movie.title} {movie.releaseYear.toString()}</p>
                )
            })}
        </div>
    )
}

export default DirectorCard