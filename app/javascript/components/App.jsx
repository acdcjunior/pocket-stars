import React from 'react';
import {ReviewsComponent} from './ReviewsComponent';
import {ProductContext} from './ProductContext';

export const App = ({productSlug, productName}) => (
    <ProductContext.Provider value={{productSlug, productName}}>
        <ReviewsComponent/>
    </ProductContext.Provider>
)