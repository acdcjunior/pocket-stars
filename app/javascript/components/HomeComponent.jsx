import React, {useEffect, useState} from 'react';
import $ from "jquery";
import {ReviewListComponent, ReviewListJQueryComponent} from "./ReviewListComponent";
import {NewReviewModalComponent} from "./NewReviewModalComponent";

export const HomeComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [renderReviewListCallback, setRenderReviewListCallback] = useState(() => () => {
        alert('was called before should!'); // this code will be removed when ReviewListJQueryComponent is refactored
    })

    const handleNewReviewSaved = () => {
        renderReviewListCallback();
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // scroll to bottom of page
        }, 300);
    };

    useEffect(() => {
        const { renderReviewList } = ReviewListJQueryComponent($('#review-list'), $('#average-rating'), $('#average-rating-stars'));
        setRenderReviewListCallback(() => renderReviewList);

        $('#add-review-btn').click(() => {
            setShowModal(true);
        });
    }, [])

    return (
        <div className="content">
            <h1 id="main-header">The Minimalist Entrepreneur</h1>

            <ReviewListComponent/>

            <NewReviewModalComponent
                showModal={showModal}
                onHideModalRequested={() => setShowModal(false)}
                onNewReviewSaved={handleNewReviewSaved}
            />
        </div>
    );
}
