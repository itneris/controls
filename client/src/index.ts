import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './test/test';

const rootElement = ReactDOM.createRoot(document.getElementById("root"));

rootElement.render(
    <React.StrictMode>
        <Test />
    </React.StrictMode>
);
