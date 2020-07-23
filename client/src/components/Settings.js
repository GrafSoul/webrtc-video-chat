import React from 'react';

export default function Settings({
    startChat,
    settingsVideo,
    videoSelect,
    audioInputSelect,
    audioOutputSelect,
}) {
    return (
        <div className="container">
            <section className="create-room settings">
                <h2>Configure your camera and audio devices</h2>

                <video
                    id="video"
                    poster="images/poster.jpg"
                    ref={settingsVideo}
                    autoPlay
                    playsInline
                ></video>

                <div className="select">
                    <label htmlFor="videoSource">Video source:</label>
                    <select id="videoSource" ref={videoSelect}></select>
                </div>

                <div className="select">
                    <label htmlFor="audioSource">Audio input:</label>
                    <select id="audioSource" ref={audioInputSelect}></select>
                </div>

                <div className="select">
                    <label htmlFor="audioOutput">Audio output:</label>
                    <select id="audioOutput" ref={audioOutputSelect}></select>
                </div>

                <div className="crete-info">
                    <b>Note:</b> If you hear a reverb sound your microphone is
                    picking up the output of your speakers/headset, lower the
                    volume and/or move the microphone further away from your
                    speakers/headset.
                </div>

                <div className="btn-go">
                    <button onClick={startChat}>Start Chat</button>
                </div>
            </section>
        </div>
    );
}
