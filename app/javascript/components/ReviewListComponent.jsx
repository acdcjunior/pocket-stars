import React from 'react';
import {StarComponent} from './StarComponent';
import {FULL_STARS, getAverageRating, getReviewModelRatingAsDecimal} from '../app/reviewsModel';


export const ReviewListComponent = ({ reviews, onAddReviewRequested }) => {
    const averageRating = getAverageRating(reviews);
    const averageRatingStars = +averageRating;

    return (
        <div>
            <div id="average-rating-box">
                <span id="average-rating" style={{visibility: reviews === null ? 'hidden' : null}}>{ averageRating }</span>
                <div id="average-rating-stars" style={{visibility: reviews === null ? 'hidden' : null}}>
                    <StarComponent starType={averageRatingStars >= 1 ? 'FULL' : (averageRatingStars >= 0.5 ? 'HALF' : 'EMPTY')} includeSvgDefs={true}/>
                    <StarComponent starType={averageRatingStars >= 2 ? 'FULL' : (averageRatingStars >= 1.5 ? 'HALF' : 'EMPTY')} />
                    <StarComponent starType={averageRatingStars >= 3 ? 'FULL' : (averageRatingStars >= 2.5 ? 'HALF' : 'EMPTY')} />
                    <StarComponent starType={averageRatingStars >= 4 ? 'FULL' : (averageRatingStars >= 3.5 ? 'HALF' : 'EMPTY')} />
                    <StarComponent starType={averageRatingStars >= 5 ? 'FULL' : (averageRatingStars >= 4.5 ? 'HALF' : 'EMPTY')} />
                </div>

                <button id="add-review-btn" onClick={onAddReviewRequested}>Add review</button>
            </div>

            <hr className="divider"/>

            <h2 id="reviews-header">Reviews</h2>

            <ul id="review-list">
                {
                    reviews === null
                        ? <li>
                            <div className="notice">Loading reviews...</div>
                        </li>
                        : (
                            reviews.length === 0
                                ? <li>
                                    <div className="notice">There are no reviews yet! You could be first!</div>
                                </li>
                                : reviews.map((r, i) => (
                                        <li className='review' key={i}>
                                            <div>
                                                {FULL_STARS.map(({ asModel: { rating: ratingForThisStar }}, starKey) => (
                                                    <StarComponent
                                                        key={starKey}
                                                        starType={
                                                            r.rating >= ratingForThisStar
                                                                ? 'FULL'
                                                                : ((r.rating === (ratingForThisStar - 1) && r.half_star)
                                                                        ? 'HALF'
                                                                        : 'EMPTY'
                                                                )
                                                        }
                                                    />
                                                ))}
                                                <span className='review-rating'>{getReviewModelRatingAsDecimal(r)}</span>
                                                <span className='review-text' title={r.review}>, {r.review}</span>
                                            </div>
                                        </li>
                                    )
                                )
                        )
                }
            </ul>
        </div>
    );
}
