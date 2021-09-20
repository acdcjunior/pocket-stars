import $ from 'jquery'
import 'jquery-toast-plugin'

const starDefs  = '<defs><filter id="filter-star" x="0" y="0" width="15" height="14.9972" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="-1"/><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="shape" result="effect1_innerShadow"/></filter><linearGradient id="paint-gradient-linear" x1="0" y1="0" x2="0" y2="14.9972" gradientUnits="userSpaceOnUse"><stop stop-color="#FFCD69"/><stop offset="1" stop-color="#FDCE71"/></linearGradient></defs>';
const starOnSvg = '<svg class="svg-star-on" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter-star)"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.9473 5.66056C14.8302 5.32371 14.5446 5.07474 14.1931 5.02348L10.1582 4.40103L8.35677 0.534568C8.18835 0.219686 7.86614 0 7.5 0C7.13386 0 6.81165 0.219686 6.64323 0.534568L4.8418 4.40103L0.784945 5.02348C0.455417 5.07474 0.169825 5.32371 0.0526597 5.66056C-0.064506 5.99009 0.0160454 6.36356 0.272345 6.61254L3.21613 9.62223L2.51314 13.9061C2.46188 14.2576 2.61566 14.6091 2.89393 14.8288C3.06235 14.9459 3.24542 14.9972 3.45046 14.9972C3.59692 14.9972 3.7507 14.9606 3.90448 14.88L7.5 12.8882L11.0955 14.88C11.2493 14.9606 11.4031 14.9972 11.5495 14.9972C11.7546 14.9972 11.9376 14.9459 12.1061 14.8288C12.3843 14.6091 12.5381 14.2576 12.4869 13.9061L11.7839 9.62223L14.7277 6.61254C14.984 6.36356 15.0645 5.99009 14.9473 5.66056Z" fill="url(#paint-gradient-linear)"/></g></svg>';
const starOffSvg = '<svg class="svg-star-off" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter-star)"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.9473 5.66056C14.8302 5.32371 14.5446 5.07474 14.1931 5.02348L10.1582 4.40103L8.35677 0.534568C8.18835 0.219686 7.86614 0 7.5 0C7.13386 0 6.81165 0.219686 6.64323 0.534568L4.8418 4.40103L0.784945 5.02348C0.455417 5.07474 0.169825 5.32371 0.0526597 5.66056C-0.064506 5.99009 0.0160454 6.36356 0.272345 6.61254L3.21613 9.62223L2.51314 13.9061C2.46188 14.2576 2.61566 14.6091 2.89393 14.8288C3.06235 14.9459 3.24542 14.9972 3.45046 14.9972C3.59692 14.9972 3.7507 14.9606 3.90448 14.88L7.5 12.8882L11.0955 14.88C11.2493 14.9606 11.4031 14.9972 11.5495 14.9972C11.7546 14.9972 11.9376 14.9459 12.1061 14.8288C12.3843 14.6091 12.5381 14.2576 12.4869 13.9061L11.7839 9.62223L14.7277 6.61254C14.984 6.36356 15.0645 5.99009 14.9473 5.66056Z" fill="#E0E0E0"/></g></svg>';
const $starOnWithDefs = $(starOnSvg.replace('</svg>', starDefs + '</svg>'));
const $starOffWithDefs = $(starOffSvg.replace('</svg>', starDefs + '</svg>'));
const $starOn = $(starOnSvg);
const $starOff = $(starOffSvg);


const SHAKE_EFFECT_CLASSNAME = 'shake';

function times(times, cb) {
    return Array.from({length: times}, cb)
}

const Toast = {
    displaySuccess(message) {
        $.toast({icon: 'success', text: message, hideAfter : 5000});
    },
    displayError(message, errorResponse) {
        console.error(message, errorResponse);
        const trimmedErrorMessage = ((msg, n) => msg.substr(0, n) + (msg.length > n ? '...' : ''))(errorResponse.responseText || '', 150);
        $.toast({
            icon: 'error',
            text: message + `<br><br>Error: ${trimmedErrorMessage}`,
            hideAfter: false
        });
    }
};

function ReviewListComponent($reviewList, $averageRatingNumber, $averageRatingStars) {
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
        const avgRatingRound = Math.round(+averageRating);
        $averageRatingStars
            .children('span').empty().end()
            .children('span.defs').append([avgRatingRound !== 0 ? $starOnWithDefs.clone() : $starOffWithDefs.clone()]).end()
            .children('span:not(.defs)').append([$starOn.clone(), $starOff.clone()]).end()
            .children().removeClass('star-on').slice(0, avgRatingRound).addClass('star-on');
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


function NewReviewModalComponent(
    $newReviewModal, $newReviewStarsRoot, $newReviewReviewTextArea, $newReviewSubmitButton, $newReviewSubmitBlock, onNewReviewSaved
) {

    function SelectRatingComponent($reviewStarsRoot) {
        const $stars = $reviewStarsRoot.children();
        let selectedRating = 0;

        const selectNewRating = (rating) => {
            if (selectedRating === rating) {
                selectedRating = 0;
            } else {
                selectedRating = rating;
            }
            $stars.attr('aria-pressed', 'false')
                .slice(0, selectedRating).attr('aria-pressed', 'true')
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
        const flashInvalid = () => {
            $reviewStarsRoot.addClass(SHAKE_EFFECT_CLASSNAME);
            setTimeout(() => $reviewStarsRoot.removeClass(SHAKE_EFFECT_CLASSNAME), 300);
        }
        const initView = () => {
            $reviewStarsRoot.children('span').append([$starOn.clone(), $starOff.clone()]);
        }
        const keysThatShouldToggleStars = [' ', 'Enter'];
        const bindEventsOnView = () => {
            $stars.each((i, e) => {
                const ratingForThisStar = i + 1;
                $(e).on({
                    mouseenter: () => highlightStarsUpTo(ratingForThisStar),
                    mouseleave: resetHighlightedStars,
                    click: () => selectNewRating(ratingForThisStar),
                    keyup: (e) => {
                        if (keysThatShouldToggleStars.includes(e.key)) {
                            selectNewRating(ratingForThisStar);
                            highlightStarsUpTo(ratingForThisStar);
                        }
                    }
                });
            });
        }

        initView();
        bindEventsOnView();
        return {
            get selectedRating() {
                return selectedRating;
            },
            resetSelectedRating,
            flashInvalid
        };
    }

    function ReviewTextAreaComponent($reviewTextArea) {
        const flashInvalidAndBringFocus = () => {
            $reviewTextArea.parent().addClass(SHAKE_EFFECT_CLASSNAME);
            setTimeout(() => $reviewTextArea.parent().removeClass(SHAKE_EFFECT_CLASSNAME), 300);
            $newReviewReviewTextArea.focus();
        }
        const resetTypedReview = () => {
            $reviewTextArea.text('')
        }
        const getTypedReviewText = () => $reviewTextArea.text().trim();

        $reviewTextArea.blur(() => {
            // workaround contenteditable bug that does not show placeholder after some multi-line text has been entered and deleted
            if (getTypedReviewText() === '') {
                resetTypedReview();
            }
        });

        return {
            get typedReview() {
                return getTypedReviewText();
            },
            resetTypedReview,
            flashInvalidAndBringFocus,
            focusTextArea: () => {
                $reviewTextArea.focus();
                if (getTypedReviewText() !== '') {
                    // if text exists, then the modal has been shown and was closed without a submit...
                    // ...so, select previously typed text to make it easier for the user to re-type
                    window.getSelection().selectAllChildren($reviewTextArea[0]);
                }
            }
        };
    }

    function Modal($reviewModal, reviewTextAreaComponent) {
        const openModal = () => {
            $reviewModal.show();
            reviewTextAreaComponent.focusTextArea();
        }
        const hideModal = () => {
            $reviewModal.hide();
        }
        const handleClickOutsideModal = () => {
            $(window).mousedown((event) => {
                if (event.target === $reviewModal[0]) {
                    hideModal();
                }
            });
        };
        const handleEscapeKeyPress = () => {
            $(document).keyup(function (e) {
                if (e.key === 'Escape') {
                    hideModal();
                }
            });
        };

        const bindEvents = () => {
            handleClickOutsideModal();
            handleEscapeKeyPress();
        }
        bindEvents();

        return {
            openModal,
            hideModal
        }
    }

    const postNewReview = review => $.ajax({
        type: 'POST',
        url: '/reviews',
        dataType: 'json',
        data: { review }
    });

    const validRatings = [1, 2, 3, 4, 5];
    const validateNewReview = ({ rating, review }) => {
        const isRatingInvalid = !validRatings.includes(rating);
        const isReviewInvalid = !review.trim().length > 0;
        return {
            isRatingInvalid,
            isReviewInvalid,
            anyInvalid: isRatingInvalid || isReviewInvalid
        }
    };

    const markFormAsSubmittingNow = () => {
        $newReviewSubmitBlock.show();
        $newReviewSubmitButton.text($newReviewSubmitButton.data('submitting-text'));
    };
    const markFormAsSubmissionCompleted = () => {
        $newReviewSubmitBlock.hide();
        $newReviewSubmitButton.text($newReviewSubmitButton.data('submitted-text'));
    };

    const bindSubmitClick = (selectedRatingModel, reviewTextModel, modal) => {
        const submitReview = () => {
            const newReview = {
                rating: selectedRatingModel.selectedRating,
                review: reviewTextModel.typedReview.trim()
            };

            const validationResult = validateNewReview(newReview);
            if (validationResult.anyInvalid) {
                if (validationResult.isRatingInvalid) {
                    selectedRatingModel.flashInvalid();
                }
                if (validationResult.isReviewInvalid) {
                    reviewTextModel.flashInvalidAndBringFocus();
                }
                return;
            }

            markFormAsSubmittingNow();
            postNewReview(newReview)
                .done(() => {
                    Toast.displaySuccess('Your new review has been submitted! Thanks!');

                    selectedRatingModel.resetSelectedRating();
                    reviewTextModel.resetTypedReview();

                    modal.hideModal()

                    onNewReviewSaved();
                })
                .fail((errorResponse) => {
                    Toast.displayError(
                        'Oops! Found an error while attempting to save your new reviews! Please wait a few moments and try again!',
                        errorResponse
                    );
                })
                .always(() => {
                    markFormAsSubmissionCompleted();
                });
        };

        $newReviewSubmitButton.click(submitReview);
    };

    function init() {
        const selectedRatingModel = SelectRatingComponent($newReviewStarsRoot);
        const reviewTextAreaComponent = ReviewTextAreaComponent($newReviewReviewTextArea);
        const modal = Modal($newReviewModal, reviewTextAreaComponent);

        bindSubmitClick(selectedRatingModel, reviewTextAreaComponent, modal);

        return {
            openModal: modal.openModal
        }
    }

    const { openModal } = init();

    return {
        openModal
    }
}

$(async () => {
    const { renderReviewList } = ReviewListComponent($('#review-list'), $('#average-rating'), $('#average-rating-stars'));

    const { openModal } = NewReviewModalComponent(
        $('#new-review-modal'),
        $('#new-rating-stars'),
        $('#new-review-review-textarea'),
        $('#new-review-submit-btn'),
        $('#new-review-submit-block'),
        () => {
            renderReviewList();
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // scroll to bottom of page
            }, 300);
        })

    $('#add-review-btn').click(() => {
        openModal();
    });
})