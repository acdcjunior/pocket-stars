import React from 'react';
import {StarComponent} from './StarComponent';
import {getAverageRating, STARS} from '../app/reviewsModel';


export const ReviewListComponent = ({ reviews, onAddReviewRequested }) => {
    const averageRating = getAverageRating(reviews);
    const averageRatingStars = Math.ceil(+averageRating);

    return (
        <div>
            <div id="average-rating-box">
                <span id="average-rating">{ averageRating }</span>
                <div id="average-rating-stars">
                    <StarComponent on={averageRatingStars >= 1} includeSvgDefs={true} />
                    <StarComponent on={averageRatingStars >= 2} />
                    <StarComponent on={averageRatingStars >= 3} />
                    <StarComponent on={averageRatingStars >= 4} />
                    <StarComponent on={averageRatingStars >= 5} />
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
                                                {STARS.map(({rating: ratingForThisStar}, starKey) => (
                                                    <StarComponent on={r.rating >= ratingForThisStar} key={starKey}/>
                                                ))}
                                                <span className='review-rating'>{r.rating}</span>
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
