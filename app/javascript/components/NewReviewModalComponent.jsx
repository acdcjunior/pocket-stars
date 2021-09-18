import React from 'react';
import $ from "jquery";
import {Toast} from "./Toast";
import {$starOff, $starOn} from "./StarComponent";

const SHAKE_EFFECT_CLASSNAME = 'shake';


function SelectRatingJQueryComponent($reviewStarsRoot) {
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


function ReviewTextAreaJQueryComponent($reviewTextArea) {
    const flashInvalidAndBringFocus = () => {
        $reviewTextArea.parent().addClass(SHAKE_EFFECT_CLASSNAME);
        setTimeout(() => $reviewTextArea.parent().removeClass(SHAKE_EFFECT_CLASSNAME), 300);
        $reviewTextArea.focus();
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

function ModalJQuery($reviewModal, reviewTextAreaComponent) {
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

export function NewReviewModalJQueryComponent(
    $newReviewModal, $newReviewStarsRoot, $newReviewReviewTextArea, $newReviewSubmitButton, $newReviewSubmitBlock, onNewReviewSaved
) {

    const postNewReview = review => $.ajax({
        type: 'POST',
        url: '/reviews',
        dataType: 'json',
        data: {
            review,
            authenticity_token: $('[name="csrf-token"]').attr('content')
        }
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
        const selectedRatingModel = SelectRatingJQueryComponent($newReviewStarsRoot);
        const reviewTextAreaComponent = ReviewTextAreaJQueryComponent($newReviewReviewTextArea);
        const modal = ModalJQuery($newReviewModal, reviewTextAreaComponent);

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


export const NewReviewModalComponent = () => {

    return (
        <div id="new-review-modal" className="modal">
            <div className="modal-content">
                <h1 id="new-review-header">What’s your rating?</h1>

                <h3 id="new-review-rating-header">Rating</h3>
                <div id="new-rating-stars">
                    <span className="star" tabIndex="0" role="button" aria-pressed="false" aria-label="Rate as one star"/>
                    <span className="star" tabIndex="0" role="button" aria-pressed="false" aria-label="Rate as two stars"/>
                    <span className="star" tabIndex="0" role="button" aria-pressed="false" aria-label="Rate as three stars"/>
                    <span className="star" tabIndex="0" role="button" aria-pressed="false" aria-label="Rate as four stars"/>
                    <span className="star" tabIndex="0" role="button" aria-pressed="false" aria-label="Rate as five stars"/>
                </div>

                <label htmlFor="new-review-review-textarea" id="new-review-review-label">Review</label>
                <div id="new-review-review-textarea-expansion-zone">
                    <div id="new-review-review-textarea" role="textbox" contentEditable data-placeholder="Start typing..."/>
                </div>

                <button id="new-review-submit-btn" data-submitting-text="Submitting..." data-submitted-text="Submit review">Submit review</button>
            </div>
            <div id="new-review-submit-block" style={{display: 'none'}}/>
        </div>
    );
}