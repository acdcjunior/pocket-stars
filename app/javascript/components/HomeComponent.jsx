import React, {useEffect, useState} from 'react';
import $ from 'jquery';
import {ReviewListComponent} from './ReviewListComponent';
import {NewReviewModalComponent} from './NewReviewModalComponent';
import {Toast} from './Toast';

export const HomeComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState(null); // [{ rating: 1, review: ''}]

    const loadReviews = () => {
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
        fetchReviews().then(rs => setReviews(rs));
    };

    useEffect(() => {
        loadReviews();
    }, [])

    const handleNewReviewSaved = () => {
        loadReviews();
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // scroll to bottom of page
        }, 300);
    };
    const handleAddReviewRequested = () => {
        setShowModal(true);
    }

    return (
        <div className="content">
            <h1 id="main-header">The Minimalist Entrepreneur</h1>

            <ReviewListComponent reviews={reviews} onAddReviewRequested={handleAddReviewRequested} />

            <NewReviewModalComponent
                showModal={showModal}
                onHideModalRequested={() => setShowModal(false)}
                onNewReviewSaved={handleNewReviewSaved}
            />
        </div>
    );
}
