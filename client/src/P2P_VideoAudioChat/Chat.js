import React, { useEffect, useState } from 'react';
// eslint-disable-next-line
import adapter from 'webrtc-adapter';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ExitButton from '../components/ExitButton';
import Loader from '../components/Loader';
import VideoPlayer from '../components/VideoPlayer';
import Settings from '../components/Settings';

const Chat = ({ match, history }) => {
    const [constraints, setConstraints] = useState({});
    const [onlyAudio, setOnlyAudio] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [open, setSOpen] = useState(false);

    const id = match.params.id;

    useEffect(() => {
        setTimeout(() => setSpinner(true), 1000);
    });

    const exitRoom = () => {
        history.push('/');
    };

    const startChat = (param) => {
        setConstraints(param);
        setSOpen(true);
    };

    const handleOnlyAudio = () => {
        setOnlyAudio(true);
    };

    return (
        <>
            <Header />

            <ExitButton exitRoom={exitRoom} />

            {!open && (
                <Settings
                    startChat={startChat}
                    handleOnlyAudio={handleOnlyAudio}
                    onlyAudio={onlyAudio}
                />
            )}

            {open && (
                <VideoPlayer
                    id={id}
                    history={history}
                    constraints={constraints}
                    onlyAudio={onlyAudio}
                />
            )}

            {!spinner && (
                <div className="loader">
                    <Loader />
                </div>
            )}

            <Footer />
        </>
    );
};

export default Chat;
