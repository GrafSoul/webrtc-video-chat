import React from 'react';

const SettingsRoom = ({
    settings,
    handleToggleSettings,
    audioSource,
    audioOutput,
    videoSource,
}) => {
    return (
        <div className={['settings', settings ? 'active' : null].join(' ')}>
            <button
                className="btn-close"
                onClick={handleToggleSettings}
                title="Close"
            >
                <span className="icon icon-close"></span>
            </button>

            <h2>Settings</h2>

            <video autoPlay></video>

            <p className="info">
                Get available audio, video sources and audio output devices and
                then install source
            </p>

            <div className="select">
                <label htmlFor="audioSource">Audio input: </label>
                <select id="audioSource" ref={audioSource}></select>
            </div>

            <div className="select">
                <label htmlFor="audioOutput">Audio output: </label>
                <select id="audioOutput" ref={audioOutput}></select>
            </div>

            <div className="select">
                <label htmlFor="videoSource">Video input: </label>
                <select id="videoSource" ref={videoSource}></select>
            </div>

            <p className="info">
                <b>Note:</b> If you hear a reverb sound your microphone is
                picking up the output of your speakers/headset, lower the volume
                and/or move the microphone further away from your
                speakers/headset.
            </p>
        </div>
    );
};

export default SettingsRoom;
