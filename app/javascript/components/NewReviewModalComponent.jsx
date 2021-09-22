import React, {useContext, useEffect, useRef, useState} from 'react';
import $ from "jquery";
import {Toast} from "./Toast";
import {StarComponent} from "./StarComponent";
import {createNewReview, postNewReview, STARS, ZERO_STARS, ZERO_STARTS_VALUE} from "../app/reviewsModel";
import {ProductContext} from "./ProductContext";

const SHAKE_EFFECT_CLASSNAME = 'shake';

const STAR_PAIRS = [...STARS]
    .filter(s => s !== ZERO_STARS)
    .sort((a, b) => a.order - b.order)
    .reduce((acc, _, i, arr) => (i % 2 === 0) ? [...acc, arr.slice(i, i + 2)] : acc, []);

const keysThatShouldToggleStars = [' ', 'Enter'];

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
const SelectRatingComponent = ({selectedRating, onSelectRating, flashInvalid}) => {
    const [highlightedRating, setHighlightedRating] = useState(selectedRating);

    useEffect(() => {
        // when selectedRating is reset by the parent
        setHighlightedRating(selectedRating);
    }, [selectedRating]);

    const resetHighlightedStars = () => {
        setHighlightedRating(selectedRating);
    }

    return (
        <div id="new-rating-stars" className={flashInvalid ? SHAKE_EFFECT_CLASSNAME : ''}>
            {STAR_PAIRS.map(([halfRating, fullRating]) =>
                <span key={halfRating.order}>
                    <StarComponent
                        starType={
                            fullRating.equalToOrLessThan(highlightedRating)
                                ? 'FULL'
                                : (halfRating.equalToOrLessThan(highlightedRating)
                                    ? 'HALF'
                                    : 'EMPTY'
                                )
                        }
                    />
                    <span
                        className='star-first-half-click-overlay'
                        tabIndex="0"
                        role="button"
                        aria-pressed={halfRating.equalToOrGreaterThan(selectedRating)}
                        aria-label={`Rate as ${halfRating.name}`}
                        onMouseEnter={() => setHighlightedRating(halfRating.rating) }
                        onMouseLeave={resetHighlightedStars}
                        onClick={() => onSelectRating(halfRating.rating)}
                        onKeyUp={(e) => keysThatShouldToggleStars.includes(e.key) && onSelectRating(halfRating.rating)}
                    >
                    </span>
                    <span
                        className='star-second-half-click-overlay'
                        tabIndex="0"
                        role="button"
                        aria-pressed={fullRating.equalToOrGreaterThan(selectedRating)}
                        aria-label={`Rate as ${fullRating.name}`}
                        onMouseEnter={() => setHighlightedRating(fullRating.rating) }
                        onMouseLeave={resetHighlightedStars}
                        onClick={() => onSelectRating(fullRating.rating)}
                        onKeyUp={(e) => keysThatShouldToggleStars.includes(e.key) && onSelectRating(fullRating.rating)}
                    >
                    </span>
                </span>
            )}
        </div>
    )
}

const isNotMobileDevice = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // https://stackoverflow.com/a/29509267/1850609

/**
 * Relevant features:
 * - parent can get typed review
 * - parent can reset typed review, which will just empty the typed text
 * - parent can flashInvalid, which will shake it and bring focus to the textarea
 * - parent can focus the textarea, which will select the whole typed text if there is any
 *
 * NOTE: We use contenteditable instead of a plain textarea because we wanted it to expand as we typed, and
 * not mess the display like changing the modal's height
 */
const ReviewTextAreaComponent = ({show, typedReview, onChangeTypedReview, flashInvalid}) => {
    const textareaEl = useRef(null);

    useEffect(() => {
        if (isNotMobileDevice && show) { // only focus if not mobile; the v. keyboard makes it clunky on those devices
            textareaEl.current.focus();
            if (typedReview !== '') {
                // if text exists, then the modal has been shown and was closed without a submit...
                // ...so, select previously typed text to make it easier for the user to re-type
                window.getSelection().selectAllChildren(textareaEl.current);
            }
        }
    }, [show]);

    useEffect(() => {
        if (flashInvalid && isNotMobileDevice) {
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
const SubmitNewReviewButtonComponent = ({onSubmitNewReview}) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitNewReview = async () => {
        setSubmitting(true);
        try {
            await onSubmitNewReview();
        } finally {
            setSubmitting(false);
        }
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
export const NewReviewModalComponent = ({showModal, onHideModalRequested, onNewReviewSaved}) => {
    const product = useContext(ProductContext);
    const [selectedRating, setSelectedRating] = useState(ZERO_STARTS_VALUE);
    const [flashInvalidRating, setFlashInvalidRating] = useState(false);
    const [typedReview, setTypedReview] = useState('');
    const [flashInvalidTypedReview, setFlashInvalidTypedReview] = useState(false);

    const hideModal = () => onHideModalRequested();
    const resetSelectedRating = () => {
        setSelectedRating(ZERO_STARTS_VALUE);
    };
    const resetTypedReview = () => {
        setTypedReview('');
    };
    const handleSelectNewRating = (rating) => {
        if (selectedRating === rating) {
            setSelectedRating(ZERO_STARTS_VALUE);
        } else {
            setSelectedRating(rating);
        }
    }

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
        const validationResult = createNewReview({ selectedRating, typedReview });
        if (validationResult.thereAreInvalidParameters) {
            if (validationResult.isSelectedRatingInvalid) {
                setFlashInvalidRating(true);
            }
            if (validationResult.isTypedReviewInvalid) {
                setFlashInvalidTypedReview(true);
            }
            setTimeout(() => {
                setFlashInvalidRating(false);
                setFlashInvalidTypedReview(false);
            }, 300);
            return;
        }

        return postNewReview(product.productSlug, validationResult.reviewAsModel).done(() => {
            Toast.displaySuccess('Your new review has been submitted! Thanks!');

            resetSelectedRating();
            resetTypedReview();
            hideModal();

            onNewReviewSaved();
        }).fail((errResp) => {
            Toast.displayError('Oops! Found an error while attempting to save your review! Please wait a few moments and try again!', errResp);
        });
    };

    return (
        <div id="new-review-modal" className={'modal ' + (showModal ? '' : 'modal-hide')}>
            <div className="modal-content">
                <h1 id="new-review-header">What’s your rating?</h1>

                <h3 id="new-review-rating-header">Rating</h3>
                <SelectRatingComponent selectedRating={selectedRating} onSelectRating={handleSelectNewRating} flashInvalid={flashInvalidRating}/>

                <ReviewTextAreaComponent show={showModal} typedReview={typedReview} onChangeTypedReview={setTypedReview} flashInvalid={flashInvalidTypedReview}/>

                <SubmitNewReviewButtonComponent onSubmitNewReview={handleSubmitNewReview}/>
            </div>
        </div>
    );
};
