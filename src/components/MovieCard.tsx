import '../css/infocard.css'
import { MovieCardProps } from '../interfaces/Interfaces'
import { ReactElement } from 'react'

const MovieCard = ({ content }: MovieCardProps): ReactElement => {
    return (
        <div className='card'>
            <h2 className='card-title'>{content.title}</h2>

            <p><span>Released:</span> {content.releaseYear}</p>
            <p><span>Genre:</span> {content.genre}</p>
            <p><span>Directed by:</span> {content.director.name}</p>
            <p><span>Length:</span> {content.length} minutes</p>
        </div>
    )
}

export default MovieCard