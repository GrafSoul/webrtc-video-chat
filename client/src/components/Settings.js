import React, { useRef, useEffect } from 'react';
// eslint-disable-next-line
import adapter from 'webrtc-adapter';

import AudioMeter from './AudioMeter';

export default function Settings({ startChat, handleOnlyAudio, onlyAudio }) {
    const videoElement = useRef();
    const audioInputSelect = useRef();
    const audioOutputSelect = useRef();
    const videoSelect = useRef();
    const constraints = useRef();

    useEffect(() => {
        const selectors = [
            audioInputSelect.current,
            audioOutputSelect.current,
            videoSelect.current,
        ];
        audioOutputSelect.current.disabled = !(
            'sinkId' in HTMLMediaElement.prototype
        );

        function gotDevices(deviceInfos) {
            const values = selectors.map((select) => select.value);
            selectors.forEach((select) => {
                while (select.firstChild) {
                    select.removeChild(select.firstChild);
                }
            });

            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
                const option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'audioinput') {
                    option.text =
                        deviceInfo.label ||
                        `microphone ${audioInputSelect.current.length + 1}`;
                    audioInputSelect.current.appendChild(option);
                } else if (deviceInfo.kind === 'audiooutput') {
                    option.text =
                        deviceInfo.label ||
                        `speaker ${audioOutputSelect.current.length + 1}`;
                    audioOutputSelect.current.appendChild(option);
                } else if (deviceInfo.kind === 'videoinput') {
                    option.text =
                        deviceInfo.label ||
                        `camera ${videoSelect.current.length + 1}`;
                    videoSelect.current.appendChild(option);
                } else {
                    console.log(
                        'Some other kind of source/device: ',
                        deviceInfo,
                    );
                }
            }

            selectors.forEach((select, selectorIndex) => {
                if (
                    Array.prototype.slice
                        .call(select.childNodes)
                        .some((n) => n.value === values[selectorIndex])
                ) {
                    select.value = values[selectorIndex];
                }
            });
        }

        navigator.mediaDevices
            .enumerateDevices()
            .then(gotDevices)
            .catch(handleError);

        function changeAudioDestination() {
            const audioDestination = audioOutputSelect.current.value;
            attachSinkId(videoElement.current, audioDestination);
        }

        function start() {
            const audioSource = audioInputSelect.current.value;
            const videoSource = videoSelect.current.value;

            constraints.current = {
                audio: {
                    deviceId: audioSource ? { exact: audioSource } : undefined,
                },
                video: onlyAudio
                    ? false
                    : {
                          deviceId: videoSource
                              ? { exact: videoSource }
                              : undefined,
                      },
            };

            navigator.mediaDevices
                .getUserMedia(constraints.current)
                .then(gotStream)
                .then(gotDevices)
                .catch(handleError);
        }

        audioInputSelect.current.onchange = start;
        audioOutputSelect.current.onchange = changeAudioDestination;

        videoSelect.current.onchange = start;

        start();

        function handleError(error) {
            handleOnlyAudio();
            console.log(
                'navigator.MediaDevices.getUserMedia error: ',
                error.message,
                error.name,
            );
        }
    }, [onlyAudio, handleOnlyAudio]);

    function attachSinkId(element, sinkId) {
        if (typeof element.sinkId !== 'undefined') {
            element
                .setSinkId(sinkId)
                .then(() => {
                    console.log(
                        `Success, audio output device attached: ${sinkId}`,
                    );
                })
                .catch((error) => {
                    let errorMessage = error;
                    if (error.name === 'SecurityError') {
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                    }
                    console.error(errorMessage);
                    // Jump back to first output device in the list as it's the default.
                    audioOutputSelect.current.selectedIndex = 0;
                });
        } else {
            console.warn('Browser does not support output device selection.');
        }
    }

    function gotStream(stream) {
        videoElement.current.srcObject = stream;
        return navigator.mediaDevices.enumerateDevices();
    }

    return (
        <>
            <div className="container">
                <section className="create-room settings">
                    <h2>
                        Configure your {onlyAudio ? null : 'camera and '} audio
                        devices
                    </h2>

                    {onlyAudio && (
                        <h3>
                            You do not have a video camera connected,
                            <br /> you can only communicate by voice
                        </h3>
                    )}

                    <div className={[onlyAudio ? 'invisible' : null]}>
                        <div className="video-content">
                            <video
                                id="video"
                                poster="images/poster.jpg"
                                autoPlay
                                playsInline
                                ref={videoElement}
                            ></video>
                        </div>

                        <div className="select">
                            <label htmlFor="videoSource">Video source:</label>
                            <select id="videoSource" ref={videoSelect}></select>
                        </div>
                    </div>

                    <div className="select">
                        <label htmlFor="audioSource">Audio input:</label>
                        <AudioMeter />
                        <select
                            id="audioSource"
                            ref={audioInputSelect}
                        ></select>
                    </div>

                    <div className="select">
                        <label htmlFor="audioOutput">Audio output:</label>
                        <select
                            id="audioOutput"
                            ref={audioOutputSelect}
                        ></select>
                    </div>

                    <div className="crete-info">
                        <b>Note:</b> If you hear a reverb sound your microphone
                        is picking up the output of your speakers/headset, lower
                        the volume and/or move the microphone further away from
                        your speakers/headset.
                    </div>

                    <div className="btn-go">
                        <button onClick={() => startChat(constraints.current)}>
                            Start {onlyAudio ? 'Audio' : 'Video'} Chat
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}
