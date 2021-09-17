import $ from "jquery"

function times(times, cb) {
    return Array.from({length: times}, cb)
}

function displaySuccessToast(message) {
    $.toast({icon: 'success', text: message, hideAfter : 5000});
}
function displayErrorToast(message, errorResponse) {
    console.error(message, errorResponse);
    const trimmedErrorMessage = ((msg, n) => msg.substr(0, n) + (msg.length > n ? '...' : ''))(errorResponse.responseText || '', 150);
    $.toast({
        icon: 'error',
        text: message + `<br><br>Error: ${trimmedErrorMessage}`,
        hideAfter: false
    });
}
function fetchReviews() {
    return $.ajax({url: "/reviews", dataType: "json"})
        .catch(errorResponse => {
            displayErrorToast('Oops! Found an error while attempting to fetch the reviews! Please reload the page in a few moments to try again!', errorResponse);
            return [];
        });
}


function starComponent(filled) {
    return $('<span>').addClass(['star', filled ? 'star-on' : null])
}
function starsComponent(rating) {
    return $("<span>")
        .append(times(rating, () => starComponent(true)))
        .append(times(5-rating, () => starComponent(false)))
}
function reviewComponent(review) {
    return $(`<li>`)
        .append($("<span>").append(starsComponent(review.rating)))
        .append($("<span>", { text: review.rating }))
        .append($("<span>", { text: ", " }))
        .append($("<span>", { text: review.review }))
        .append($(`<a href='/reviews/${review.id}/edit' style="display: inline-block; margin-left: 10px">EDIT</a>`));
}
function replaceReviews(reviews) {
    const $reviewList = $("#review-list");
    $reviewList.empty();
    reviews.forEach((r) => {
        $reviewList.append(reviewComponent(r))
    });
}

async function renderReviews() {
    const reviews = await fetchReviews();
    replaceReviews(reviews);
    const averageRating = !reviews.length ? "0" : (reviews.map(r => r.rating).reduce((r1, r2) => r1 + r2) / reviews.length).toFixed(1);
    $("#average-rating").text(averageRating.replace(/\.0$/, ""));
    $("#average-rating-stars").empty().append(starsComponent(Math.ceil(+averageRating)));
}


function NewRatingModalComponent(onSaveNewRating) {

    function postNewReview(review) {
        return $.ajax({
            type: "POST",
            url: "/reviews",
            dataType: "json",
            data: {review}
        });
    }

    function SelectRatingComponent($starsRootJQueryObject) {
        const $stars = $starsRootJQueryObject.children();
        let selectedRating = 0;

        const selectNewRating = (rating) => {
            if (selectedRating === rating) {
                selectedRating = 0;
            } else {
                selectedRating = rating;
            }
        }
        const resetSelectedRating = () => {
            selectNewRating(0);
            resetHighlightedStars();
        };
        const highlightStarsUpTo = (rating) => {
            $stars.removeClass('star-on')
                .slice(0, rating).addClass('star-on')
        }
        const resetHighlightedStars = () => {
            highlightStarsUpTo(selectedRating);
        }
        const bindEventsOnView = () => {
            $stars.each((i, e) => {
                const ratingForThisStar = i + 1;
                $(e).on({
                    mouseenter: () => highlightStarsUpTo(ratingForThisStar),
                    mouseleave: resetHighlightedStars,
                    click: () => selectNewRating(ratingForThisStar)
                });
            });
        }

        bindEventsOnView();
        return {
            get selectedRating() {
                return selectedRating;
            },
            resetSelectedRating
        };
    }

    function ReviewTextAreaComponent($reviewTextAreaJQueryObject) {
        return {
            get typedReview() {
                return $reviewTextAreaJQueryObject.val();
            },
            resetTypedReview() {
                $reviewTextAreaJQueryObject.val('')
            }
        };
    }

    const selectedRatingModel = SelectRatingComponent($("#new-rating-stars"));
    const reviewTextModel = ReviewTextAreaComponent($("#new-rating-textarea"));

    $("#new-rating-submit-btn").click(() => {
        const newReview = {
            rating: selectedRatingModel.selectedRating,
            review: reviewTextModel.typedReview
        };
        console.log('new review:', newReview);

        postNewReview(newReview)
            .done(() => {
                displaySuccessToast('Your new review has been posted! Thanks!');

                selectedRatingModel.resetSelectedRating();
                reviewTextModel.resetTypedReview();

                $("#new-rating-form").removeClass("modal");

                onSaveNewRating();
            })
            .fail((errorResponse) => {
                displayErrorToast('Oops! Found an error while attempting to save your new reviews! Please wait a few moments and try again!', errorResponse);
            });
    });
}

$(async () => {
    renderReviews();

    $("#add-review-btn").click(() => {
        $("#new-rating-form").addClass("modal");
    });

    NewRatingModalComponent(() => {
        renderReviews();
    })
})