export const STARS = [
    { rating: 1, name: 'one' },
    { rating: 2, name: 'two' },
    { rating: 3, name: 'three' },
    { rating: 4, name: 'four' },
    { rating: 5, name: 'five' },
];

const validRatings = [1, 2, 3, 4, 5];

export const validateNewReview = ({ rating, review }) => {
    const isRatingInvalid = !validRatings.includes(rating);
    const isReviewInvalid = !review.trim().length > 0;
    return {
        isRatingInvalid,
        isReviewInvalid,
        anyInvalid: isRatingInvalid || isReviewInvalid
    }
};

export const getAverageRating = reviews => !reviews?.length
    ? '0'
    : (reviews.map(r => r.rating).reduce((r1, r2) => r1 + r2) / reviews.length).toFixed(1).replace(/\.0$/, '');
