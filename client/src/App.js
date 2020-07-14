import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

import CreateRoom from './routes/CreateRoom';
import Room from './routes/Room';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={CreateRoom} />
                    <Route path="/room/:roomID" component={Room} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
