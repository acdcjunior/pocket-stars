import React from 'react';
import $ from "jquery";
import {ReviewListComponent, ReviewListJQueryComponent} from "./ReviewListComponent";
import {NewReviewModalComponent, NewReviewModalJQueryComponent} from "./NewReviewModalComponent";

export const HomeComponent = () => (
    <div className="content">
        <h1 id="main-header">The Minimalist Entrepreneur</h1>

        <ReviewListComponent />

        <NewReviewModalComponent />
    </div>
)

export const initHome = () => {
    const { renderReviewList } = ReviewListJQueryComponent($('#review-list'), $('#average-rating'), $('#average-rating-stars'));

    const { openModal } = NewReviewModalJQueryComponent(
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