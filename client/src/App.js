import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CreateRoom from './p2p_videochat/CreateRoom';
import Room from './p2p_videochat/Room';

function App() {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={CreateRoom} />
                    <Route path="/room/:roomID" component={Room} />
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default App;
