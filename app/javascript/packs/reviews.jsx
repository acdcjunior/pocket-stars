import 'channels';
import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "../components/App";

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    ReactDOM.render(
        <React.StrictMode>
            <App {...root.dataset} />
        </React.StrictMode>,
        root
    );
})
