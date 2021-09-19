import React, {useEffect, useRef, useState} from 'react';
import $ from "jquery";
import {Toast} from "./Toast";
import {StarComponent} from "./StarComponent";

const SHAKE_EFFECT_CLASSNAME = 'shake';
const STARS = [
    { rating: 1, name: 'one' },
    { rating: 2, name: 'two' },
    { rating: 3, name: 'three' },
    { rating: 4, name: 'four' },
    { rating: 5, name: 'five' },
];


/**
 * Relevant features:
 * - parent can get selected rating
 * - parent can reset selected rating, which will set the rating to zero and reset the highlighted stars to none
 * - parent can flash invalid, which will shake it
 * - clicking a star toggles its aria-pressed
 * - clicking a star sets its value as new rating, except if it already is (in which case the rating is set to zero)
 * - stars:
 * - mouseenter highlights the stars up to its rating
 * - mouseleave resets the highlighted stars to selected rating
 * - click updates the selected rating
 */
const SelectRatingComponent = ({ selectedRating, onSelectRating, flashInvalid }) => {
    const [highlightedRating, setHighlightedRating] = useState(selectedRating)

    useEffect(() => {
        // when selectedRating is reset by the parent
        setHighlightedRating(selectedRating);
    }, [selectedRating]);

    const handleSelectNewRating = (rating) => {
        if (selectedRating === rating) {
            onSelectRating(0);
        } else {
            onSelectRating(rating);
        }
    }
    const resetHighlightedStars = () => {
        setHighlightedRating(selectedRating);
    }

    return (
        <div id="new-rating-stars" className={flashInvalid ? SHAKE_EFFECT_CLASSNAME : ''}>
            {STARS.map(({name, rating}) =>
                <span
                    key={rating}
                    tabIndex="0"
                    role="button"
                    aria-pressed={ selectedRating >= rating }
                    aria-label={`Rate as ${name} star`}
                    onMouseEnter={() => setHighlightedRating(rating)}
                    onMouseLeave={resetHighlightedStars}
                    onClick={() => handleSelectNewRating(rating)}
                >
                    <StarComponent on={highlightedRating >= rating}/>
                </span>
            )}
        </div>
    )
}

/**
 * Relevant features:
 * - parent can get typed review
 * - parent can reset typed review, which will just empty the typed text
 * - parent can flashInvalid, which will shake it and bring focus to the textarea
 * - parent can focus the textarea, which will select the whole typed text if there is any
 */
const ReviewTextAreaComponent = ({ show, typedReview, onChangeTypedReview, flashInvalid }) => {
    const textareaEl = useRef(null);

    useEffect(() => {
        if (show) {
            textareaEl.current.focus();
            if (typedReview !== '') {
                // if text exists, then the modal has been shown and was closed without a submit...
                // ...so, select previously typed text to make it easier for the user to re-type
                window.getSelection().selectAllChildren(textareaEl.current);
            }
        }
    }, [show]);

    useEffect(() => {
        if (flashInvalid) {
            textareaEl.current.focus();
        }
    }, [flashInvalid]);

    const handleTextAreaBlur = (e) => {
        // .trim() is a workaround for a contenteditable bug that does not show placeholder after some multi-line text has been entered and deleted
        onChangeTypedReview(e.currentTarget.textContent.trim())
    }

    return (
        <>
            <label htmlFor="new-review-review-textarea" id="new-review-review-label">Review</label>
            <div id="new-review-review-textarea-expansion-zone" className={flashInvalid ? SHAKE_EFFECT_CLASSNAME : ''}>
                <div
                    id="new-review-review-textarea" ref={textareaEl} role="textbox" contentEditable data-placeholder="Start typing..."
                    onBlur={handleTextAreaBlur}
                    suppressContentEditableWarning={true}
                >
                    {typedReview}
                </div>
            </div>
        </>
    )
};


/**
 * Relevant features:
 * - parent can listen for submit button clicks
 * - div overlay that blocks any click is shown while the submit click is being handled (to prevent bad stuff like re-submits)
 */
const SubmitNewReviewButtonComponent = ({ onSubmitNewReview }) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitNewReview = async () => {
        setSubmitting(true);
        await onSubmitNewReview();
        setSubmitting(false);
    };

    return (
        <>
            <button id="new-review-submit-btn" onClick={handleSubmitNewReview}>{submitting ? 'Submitting...' : 'Submit review'}</button>
            <div id="new-review-submit-block-overlay" style={{display: submitting ? 'block' : 'none'}}/>
        </>
    )
};


/**
 * Relevant features:
 * - parent can open, which will
 *     - show the modal
 *     - 'focus' the textarea
 * - parent can hide, which will
 *     - hide the modal
 * - click outside modal hides it (or rather request that the parent hides it)
 * - escape key hides the modal
 */
export const NewReviewModalComponent = ({ showModal, onHideModalRequested, onNewReviewSaved }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [flashInvalidRating, setFlashInvalidRating] = useState(false);
    const [typedReview, setTypedReview] = useState('');
    const [flashInvalidTypedReview, setFlashInvalidTypedReview] = useState(false);

    const hideModal = () => onHideModalRequested();
    const resetSelectedRating = () => { setSelectedRating(0); };
    const resetTypedReview = () => { setTypedReview(''); };

    useEffect(() => {
        $(window).on('mousedown.clickOutsideClosesModal', (e) => {
            if (e.target.getAttribute('id') === 'new-review-modal') {
                hideModal();
            }
        });
        $(document).on('keyup.escapeKeyClosesModal', (e) => {
            if (e.key === 'Escape') {
                hideModal();
            }
        });
        return () => {
            $(window).off('mousedown.clickOutsideClosesModal');
            $(document).off('keyup.escapeKeyClosesModal');
        }
    }, []);


    const handleSubmitNewReview = () => {
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

        const newReview = {
            rating: selectedRating,
            review: typedReview
        };

        const validationResult = validateNewReview(newReview);
        if (validationResult.anyInvalid) {
            if (validationResult.isRatingInvalid) {
                setFlashInvalidRating(true);
            }
            if (validationResult.isReviewInvalid) {
                setFlashInvalidTypedReview(true);
            }
            setTimeout(() => {
                setFlashInvalidRating(false);
                setFlashInvalidTypedReview(false);
            }, 300);
            return;
        }

        return postNewReview(newReview)
            .done(() => {
                Toast.displaySuccess('Your new review has been submitted! Thanks!');

                resetSelectedRating();
                resetTypedReview();
                hideModal();

                onNewReviewSaved();
            })
            .fail((errorResponse) => {
                Toast.displayError(
                    'Oops! Found an error while attempting to save your new reviews! Please wait a few moments and try again!',
                    errorResponse
                );
            });
    };

    return (
        <div id="new-review-modal" className={'modal ' + (showModal ? '' : 'modal-hide')}>
            <div className="modal-content">
                <h1 id="new-review-header">What’s your rating?</h1>

                <h3 id="new-review-rating-header">Rating</h3>
                <SelectRatingComponent selectedRating={selectedRating} onSelectRating={setSelectedRating} flashInvalid={flashInvalidRating} />

                <ReviewTextAreaComponent show={showModal} typedReview={typedReview} onChangeTypedReview={setTypedReview} flashInvalid={flashInvalidTypedReview} />

                <SubmitNewReviewButtonComponent onSubmitNewReview={handleSubmitNewReview} />
            </div>
        </div>
    );
};
