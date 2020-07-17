import React from 'react';

const StreamControl = ({
    handleShareLink,
    handleToggleMic,
    audio,
    handleToggleCamera,
    video,
    handleToggleSound,
    sound,
    handleToggleFullScreen,
    openFullMonitor,
    handleShareMonitor,
    handleToggleSettings,
}) => {
    return (
        <div className="stream-control">
            <div className="btn-link">
                <button
                    className="btn"
                    onClick={handleShareLink}
                    title="Open Link"
                >
                    <span className="icon icon-link"></span>
                </button>
            </div>

            <div className="btn-group">
                <button
                    className="btn"
                    onClick={handleToggleMic}
                    title="Microphone ON/OFF"
                >
                    <span
                        className={[
                            'icon',
                            'icon-mic',
                            audio ? null : 'off',
                        ].join(' ')}
                    ></span>
                </button>
                <button
                    className="btn"
                    onClick={handleToggleCamera}
                    title="Camera ON/OFF"
                >
                    <span
                        className={[
                            'icon',
                            'icon-camera',
                            video ? null : 'off',
                        ].join(' ')}
                    ></span>
                </button>
                <button
                    className="btn"
                    onClick={handleToggleSound}
                    title="Sound ON/OFF"
                >
                    <span
                        className={[
                            'icon',
                            'icon-sound',
                            sound ? 'off' : null,
                        ].join(' ')}
                    ></span>
                </button>
                <button
                    className="btn"
                    onClick={handleToggleFullScreen}
                    title="Fullscreen ON/OFF"
                >
                    <span className="icon icon-fullscreen"></span>
                </button>
                <button
                    className="btn"
                    onClick={openFullMonitor}
                    title="Monitor"
                >
                    <span className="icon icon-monitor"></span>
                </button>
                <button
                    className="btn"
                    onClick={handleShareMonitor}
                    title="Share Content"
                >
                    <span className="icon icon-share"></span>
                </button>
            </div>

            <div className="btn-settings">
                <button
                    className="btn"
                    onClick={handleToggleSettings}
                    title="Open Settings"
                >
                    <span className="icon icon-settings"></span>
                </button>
            </div>
        </div>
    );
};

export default StreamControl;
