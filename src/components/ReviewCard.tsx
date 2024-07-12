import { ReactElement } from 'react'
import { ReviewCardProps } from '../interfaces/Interfaces'
import '../css/infocard.css'

const ReviewCard = ({ content }: ReviewCardProps): ReactElement => {

    return (
        <div className='card'>
            <h2 className='card-title'>{content.movie.title}</h2>

            <p><span>Score:</span> {content.score}</p>
            <p><span>Comment:</span> {content.comment}</p>
        </div>
    )

}

export default ReviewCard