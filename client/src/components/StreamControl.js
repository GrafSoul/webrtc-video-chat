import React from 'react';

if (!document.fullscreenElement) {
    Object.defineProperty(document, 'fullscreenElement', {
        get: function () {
            return (
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                document.webkitFullscreenElement
            );
        },
    });

    Object.defineProperty(document, 'fullscreenEnabled', {
        get: function () {
            return (
                document.mozFullScreenEnabled ||
                document.msFullscreenEnabled ||
                document.webkitFullscreenEnabled
            );
        },
    });
}

const StreamControl = ({
    handleShareLink,
    handleToggleMic,
    audio,
    handleToggleCamera,
    video,
    handleToggleSound,
    sound,
    handleToggleFullScreen,
    handleShareMonitor,
    handleToggleMirror,
    mirror,
    update,
    fullScreen,
    onlyAudio,
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

                <span style={onlyAudio ? { display: 'none' } : null}>
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
                        onClick={handleToggleMirror}
                        title="Mirror"
                    >
                        <span
                            className={[
                                'icon',
                                'icon-mirror',
                                mirror ? null : 'off',
                            ].join(' ')}
                        ></span>
                    </button>

                    <button
                        className="btn"
                        onClick={handleToggleFullScreen}
                        title="Fullscreen ON/OFF"
                    >
                        <span
                            className={[
                                'icon',
                                'icon-fullscreen',
                                fullScreen ? null : 'off',
                            ].join(' ')}
                        ></span>
                    </button>
                </span>

                {update && !onlyAudio && (
                    <button
                        className="btn"
                        onClick={handleShareMonitor}
                        title="Share Content"
                    >
                        <span className="icon icon-share"></span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default StreamControl;
