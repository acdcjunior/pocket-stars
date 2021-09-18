import React from 'react'
import ReactDOM from 'react-dom'
import {Home, initHome} from "../components/Home";

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Home/>,
        document.getElementById('home-root')
    );
    initHome();
})
