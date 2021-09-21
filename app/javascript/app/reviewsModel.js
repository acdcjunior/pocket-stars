import $ from 'jquery';

export const ZERO_STARTS_VALUE = 'ZERO';
export const STARS = [
    { order: 0, rating: ZERO_STARTS_VALUE,  name: 'zero stars',             asModel: { rating: 0, half_star: 0 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 1, rating: 'HALF',             name: 'half star',              asModel: { rating: 0, half_star: 1 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 2, rating: 'ONE',              name: 'one star',               asModel: { rating: 1, half_star: 0 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 3, rating: 'ONE_AND_A_HALF',   name: 'one and a half stars',   asModel: { rating: 1, half_star: 1 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 4, rating: 'TWO',              name: 'two stars',              asModel: { rating: 2, half_star: 0 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 5, rating: 'TWO_AND_A_HALF',   name: 'two and a half stars',   asModel: { rating: 2, half_star: 1 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 6, rating: 'THREE',            name: 'three stars',            asModel: { rating: 3, half_star: 0 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 7, rating: 'THREE_AND_A_HALF', name: 'three and a half stars', asModel: { rating: 3, half_star: 1 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 8, rating: 'FOUR',             name: 'four stars',             asModel: { rating: 4, half_star: 0 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 9, rating: 'FOUR_AND_A_HALF',  name: 'four and a half stars',  asModel: { rating: 4, half_star: 1 }, equalToOrGreaterThan, equalToOrLessThan },
    { order: 10, rating: 'FIVE',            name: 'five stars',             asModel: { rating: 5, half_star: 0 }, equalToOrGreaterThan, equalToOrLessThan },
]
export const ZERO_STARS = STARS.find(s => s.rating === ZERO_STARTS_VALUE);
export const FULL_STARS = STARS.filter(s => s.rating !== ZERO_STARTS_VALUE && !s.asModel.half_star);

const STARS_AS_MAP = Object.fromEntries(STARS.map(s => [s.rating, s]))
function equalToOrGreaterThan(rating) {
    return this.order >= STARS_AS_MAP[rating].order;
}
function equalToOrLessThan(rating) {
    return this.order <= STARS_AS_MAP[rating].order;
}

export const postNewReview = (productSlug, review) => $.ajax({
    type: 'POST',
    url: '/' + productSlug,
    dataType: 'json',
    data: {
        review,
        authenticity_token: $('[name="csrf-token"]').attr('content')
    }
});

export const createNewReview = ({ selectedRating, typedReview }) => {
    const selectedRatingAsStar = STARS_AS_MAP[selectedRating];
    const isSelectedRatingInvalid = selectedRatingAsStar === ZERO_STARS;
    const isTypedReviewInvalid = typedReview.length === 0;
    return {
        isSelectedRatingInvalid,
        isTypedReviewInvalid,
        thereAreInvalidParameters: isSelectedRatingInvalid || isTypedReviewInvalid,
        reviewAsModel: {
            rating: selectedRatingAsStar.asModel.rating,
            half_star: selectedRatingAsStar.asModel.half_star,
            review: typedReview
        }
    }
};

export const getReviewModelRatingAsDecimal = (reviewModel) => reviewModel.rating + (reviewModel.half_star ? 0.5 : 0);

export const getAverageRating = reviews => !reviews?.length
    ? '0'
    : (
        reviews.map(r => getReviewModelRatingAsDecimal(r)).reduce((r1, r2) => r1 + r2)
        /
        reviews.length
    ).toFixed(1).replace(/\.0$/, '');
