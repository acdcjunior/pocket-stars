import React from 'react'
import $ from "jquery";
import {ReviewListComponent} from "./ReviewListComponent";
import {NewReviewModalComponent} from "./NewReviewModalComponent";

export const Home = () => (
    <div className="content">
        <h1 id="main-header">The Minimalist Entrepreneur</h1>

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

        <hr className="divider" />

        <h2 id="reviews-header">Reviews</h2>

        <ul id="review-list">
            <li>
                <div className="notice">Loading reviews...</div>
            </li>
        </ul>

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
            <div id="new-review-submit-block" style={{display: 'none'}} />
        </div>
    </div>
)

export const initHome = () => {
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
}