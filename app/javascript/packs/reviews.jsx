import 'channels';
import React from 'react';
import ReactDOM from 'react-dom';
import {HomeComponent} from '../components/HomeComponent';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <HomeComponent/>,
        document.getElementById('home-root')
    );
})
