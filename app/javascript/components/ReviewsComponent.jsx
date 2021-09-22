import React, {useContext, useEffect, useReducer, useState} from 'react';
import {ReviewListComponent} from './ReviewListComponent';
import {NewReviewModalComponent} from './NewReviewModalComponent';
import {Toast} from './Toast';
import {liveReviewsConsumer} from "../channels/live_reviews_channel";
import {ProductContext} from "./ProductContext";


function reviewsReducer(state, {payload: {reviews: newReviews}}) {
    const currentReviews = state ?? [];
    const newReviewsIds = newReviews.map(r => r.id);
    const currentReviewsMinusOverriddenNewReviews = currentReviews.filter(r => !newReviewsIds.includes(r.id));
    return [...currentReviewsMinusOverriddenNewReviews, ...newReviews];
}

function webSocketConnectedReducer(state, action) {
    return action.type === 'connected';
}

export const ReviewsComponent = () => {
    const product = useContext(ProductContext);
    const [showModal, setShowModal] = useState(false);
    const [reviews, dispatchReviews] = useReducer(reviewsReducer, null);
    const [webSocketConnected, dispatchWebSocketConnected] = useReducer(webSocketConnectedReducer, null);

    useEffect(() => {
        // loadReviews();
        liveReviewsConsumer({
            product: product.productSlug,
            onConnected: () => dispatchWebSocketConnected({type: 'connected'}),
            onDisconnected: () => dispatchWebSocketConnected({type: 'disconnected'}),
            onDataReceived: (data) => dispatchReviews({payload: data}),
        })
    }, [])

    useEffect(() => {
        if (webSocketConnected === null) {
            return;
        }
        if (webSocketConnected) {
            Toast.displayInfo('You are now online.', 3000);
        } else {
            Toast.displayInfo('You are offline.<br>We will attempt to reconnect shortly.', 5000);
        }
    }, [webSocketConnected])

    const handleNewReviewSaved = () => {
        setTimeout(() => {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}); // scroll to bottom of page
        }, 300);
    };
    const handleAddReviewRequested = () => {
        setShowModal(true);
    }

    return (
        <div className="content">
            <h1 id="main-header">{product.productName}</h1>

            <ReviewListComponent reviews={reviews} onAddReviewRequested={handleAddReviewRequested}/>

            <NewReviewModalComponent
                showModal={showModal}
                onHideModalRequested={() => setShowModal(false)}
                onNewReviewSaved={handleNewReviewSaved}
            />
        </div>
    );
}
