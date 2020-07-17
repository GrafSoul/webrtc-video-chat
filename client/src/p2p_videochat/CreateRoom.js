import React, { useState, useEffect } from 'react';
import { v1 as uuid } from 'uuid';

import Header from '../components/Header';
import Footer from '../components/Footer';
import QRCodeImage from '../components/QRCodeImage';
import Loader from '../components/Loader';

const CreateRoom = ({ history }) => {
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        setTimeout(() => setSpinner(true), 1000);
    }, []);

    const id = uuid();
    const url = window.location.href + `room/${id}`;

    const createRoom = () => {
        history.push(`/room/${id}`);
    };

    return (
        <>
            <Header />
            <div className="container">
                <main>
                    <section className="create-room">
                        <div className="crete-info">
                            <p>
                                <strong>VID.OK</strong> - Secure Video Chat.
                                Video transfer and audio stream between browsers
                                interlocutors not giving access to third
                                parties.
                            </p>
                            <p>
                                To create a connection, click on the button -{' '}
                                <strong>"Create Room"</strong> and send the link
                                to the person with whom you want to communicate.
                            </p>
                        </div>

                        <div className="link-url">
                            <p>{url}</p>
                        </div>

                        <div className="qrcode">
                            <QRCodeImage url={url} />
                        </div>

                        <div className="btn-go">
                            <button onClick={() => createRoom()}>
                                Create Room
                            </button>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />

            {!spinner && (
                <div class="loader">
                    <Loader />
                </div>
            )}
        </>
    );
};

export default CreateRoom;
