import React from 'react'
import {BrowserRouter, Route, useHistory} from "react-router-dom";
import {Provider} from "react-redux";
import './App.css';
import store from './redux/store.js'

const AppContainer = () => {
    return (
        <div className="App">
            <h1> Hello React App!</h1>
        </div>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <AppContainer />
            </Provider>
        </BrowserRouter>
    )
}
export default App;