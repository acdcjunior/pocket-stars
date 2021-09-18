import React from 'react';
import $ from "jquery";
import {Toast} from "./Toast";
import {$starOff, $starOffWithDefs, $starOn, $starOnWithDefs} from "./StarComponent";


function times(times, cb) {
    return Array.from({length: times}, cb)
}


export function ReviewListJQueryComponent($reviewList, $averageRatingNumber, $averageRatingStars) {
    const fetchReviews = () => {
        return $.ajax({url: '/reviews', dataType: 'json'})
            .catch(errorResponse => {
                Toast.displayError(
                    'Oops! Found an error while attempting to fetch the reviews! Please reload the page in a few moments to try again!',
                    errorResponse
                );
                return [];
            });
    };

    const starComponent = filled => $('<span>').append([$starOn.clone(), $starOff.clone()]).addClass(['star', filled ? 'star-on' : null]);

    const starsComponent = rating => $('<span>')
        .attr('aria-label', `${rating}-star rating`)
        .append(times(rating, () => starComponent(true)))
        .append(times(5 - rating, () => starComponent(false)));

    const reviewComponent = review => $(`<li>`)
        .addClass('review')
        .append(
            $('<div>')
                .append($('<span>').append(starsComponent(review.rating)))
                .append($('<span>', {text: review.rating}).addClass('review-rating'))
                .append($('<span>', {text: `, ${review.review}`}).addClass('review-text').attr('title', review.review))
        );

    const replaceReviews = reviews => {
        $reviewList.empty();
        if (reviews.length === 0) {
            $reviewList.append('<li><div class="notice">There are no reviews yet! You could be first!</div></li>')
        } else {
            reviews.forEach((r) => {
                $reviewList.append(reviewComponent(r))
            });
        }
    };
    function highlightAverageRatingStars(averageRating) {
        const avgRatingCeil = Math.ceil(+averageRating);
        $averageRatingStars
            .children('span').empty().end()
            .children('span.defs').append([avgRatingCeil !== 0 ? $starOnWithDefs.clone() : $starOffWithDefs.clone()]).end()
            .children('span:not(.defs)').append([$starOn.clone(), $starOff.clone()]).end()
            .children().removeClass('star-on').slice(0, avgRatingCeil).addClass('star-on');
    }

    const renderReviewList = async () => {
        const reviews = await fetchReviews();
        replaceReviews(reviews);
        const averageRating = !reviews.length ? '0' : (reviews.map(r => r.rating).reduce((r1, r2) => r1 + r2) / reviews.length).toFixed(1);
        $averageRatingNumber.text(averageRating.replace(/\.0$/, ''));
        highlightAverageRatingStars(averageRating);
    };

    renderReviewList();

    return {
        renderReviewList
    }
}

export const ReviewListComponent = () => {

    return (
        <div>
            <div id="average-rating-box">
                <span id="average-rating"/>
                <div id="average-rating-stars">
                    <span className="star defs"/>
                    <span className="star"/>
                    <span className="star"/>
                    <span className="star"/>
                    <span className="star"/>
                </div>

                <button id="add-review-btn">Add review</button>
            </div>

            <hr className="divider"/>

            <h2 id="reviews-header">Reviews</h2>

            <ul id="review-list">
                <li>
                    <div className="notice">Loading reviews...</div>
                </li>
            </ul>
        </div>
    );
}