import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
// eslint-disable-next-line
import adapter from 'webrtc-adapter';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LinkRoom from '../components/LinkRoom';
import StreamControl from '../components/StreamControl';
import ExitButton from '../components/ExitButton';
import Loader from '../components/Loader';

const VideoPlayer = ({ id, history, constraints, onlyAudio }) => {
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const [sound, setSound] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [mirror, setMirror] = useState(false);
    const [settings, setSettings] = useState(false);
    const [shareLink, setShareLink] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [update, setUpdate] = useState(false);

    const userVideo = useRef();
    const partnerVideo = useRef();

    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const senders = useRef([]);

    useEffect(() => {
        function callUser(userID) {
            peerRef.current = createPeer(userID);
            userStream.current
                .getTracks()
                .forEach((track) =>
                    senders.current.push(
                        peerRef.current.addTrack(track, userStream.current),
                    ),
                );
        }

        function createPeer(userID) {
            const peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: 'stun:stun.stunprotocol.org',
                    },
                    {
                        urls: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com',
                    },
                ],
            });

            peer.onicecandidate = handleICECandidateEvent;
            peer.ontrack = handleTrackEvent;
            peer.onnegotiationneeded = () =>
                handleNegotiationNeededEvent(userID);

            return peer;
        }

        function handleRecieveCall(incoming) {
            peerRef.current = createPeer();
            const desc = new RTCSessionDescription(incoming.sdp);
            peerRef.current
                .setRemoteDescription(desc)
                .then(() => {
                    userStream.current
                        .getTracks()
                        .forEach((track) =>
                            peerRef.current.addTrack(track, userStream.current),
                        );
                })
                .then(() => {
                    return peerRef.current.createAnswer();
                })
                .then((answer) => {
                    return peerRef.current.setLocalDescription(answer);
                })
                .then(() => {
                    const payload = {
                        target: incoming.caller,
                        caller: socketRef.current.id,
                        sdp: peerRef.current.localDescription,
                    };
                    socketRef.current.emit('answer', payload);
                });
        }

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect('/');
            socketRef.current.emit('join room', id);
            socketRef.current.on('other user', (userID) => {
                setUpdate(true);
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on('user joined', (userID) => {
                otherUser.current = userID;
            });

            socketRef.current.on('offer', handleRecieveCall);

            socketRef.current.on('answer', handleAnswer);

            socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
        });

        setTimeout(() => setSpinner(true), 1000);
    }, [id, constraints]);

    function handleNegotiationNeededEvent(userID) {
        peerRef.current
            .createOffer()
            .then((offer) => {
                return peerRef.current.setLocalDescription(offer);
            })
            .then(() => {
                const payload = {
                    target: userID,
                    caller: socketRef.current.id,
                    sdp: peerRef.current.localDescription,
                };
                socketRef.current.emit('offer', payload);
            })
            .catch((e) => console.log(e));
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            };
            socketRef.current.emit('ice-candidate', payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    }

    function handleShareMonitor() {
        if (senders.current.length === 0) {
            return false;
        } else {
            navigator.mediaDevices
                .getDisplayMedia({ cursor: true })
                .then((stream) => {
                    const screenTrack = stream.getTracks()[0];
                    senders.current
                        .find((sender) => sender.track.kind === 'video')
                        .replaceTrack(screenTrack);
                    screenTrack.onended = function () {
                        senders.current
                            .find((sender) => sender.track.kind === 'video')
                            .replaceTrack(userStream.current.getTracks()[1]);
                    };
                });
        }
    }

    function handleToggleSettings() {
        setSettings(!settings);
    }

    function handleToggleSound() {
        setSound(!sound);
    }

    function handleToggleMic() {
        if (
            userStream.current != null &&
            userStream.current.getAudioTracks().length > 0
        ) {
            userStream.current.getAudioTracks()[0].enabled = !audio;
            setAudio(!audio);
        }
    }

    function handleToggleCamera() {
        if (
            userStream.current != null &&
            userStream.current.getVideoTracks().length > 0
        ) {
            userStream.current.getVideoTracks()[0].enabled = !video;
            setVideo(!video);
        }
    }

    function handleToggleFullScreen() {
        setFullScreen(!fullScreen);
    }

    function handleToggleMirror() {
        setMirror(!mirror);
    }

    function handleCopyLink(url) {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1000);
            })
            .catch((err) => {
                console.log('Something went wrong', err);
            });

        setTimeout(() => {
            handleShareLink();
        }, 1800);
    }

    function handleShareLink() {
        setShareLink(!shareLink);
    }

    const exitRoom = () => {
        history.push('/');
    };

    return (
        <>
            <Header />

            <ExitButton exitRoom={exitRoom} />

            <div
                className="video"
                style={onlyAudio ? { visibility: 'hidden' } : null}
            >
                <video
                    id="partner"
                    poster="images/poster.jpg"
                    autoPlay
                    muted={sound}
                    ref={partnerVideo}
                    className={[
                        mirror ? 'mirror' : null,
                        fullScreen ? 'active' : null,
                    ].join(' ')}
                ></video>
                <div className="user-video">
                    <video
                        autoPlay
                        muted
                        ref={userVideo}
                        poster="images/poster.jpg"
                    ></video>
                </div>
            </div>

            <StreamControl
                handleShareLink={handleShareLink}
                handleToggleMic={handleToggleMic}
                audio={audio}
                handleToggleCamera={handleToggleCamera}
                video={video}
                handleToggleSound={handleToggleSound}
                sound={sound}
                handleToggleFullScreen={handleToggleFullScreen}
                handleShareMonitor={handleShareMonitor}
                handleToggleSettings={handleToggleSettings}
                handleToggleMirror={handleToggleMirror}
                otherUser={otherUser.current}
                update={update}
                mirror={mirror}
                fullScreen={fullScreen}
                onlyAudio={onlyAudio}
            />

            <LinkRoom
                shareLink={shareLink}
                handleShareLink={handleShareLink}
                handleCopyLink={handleCopyLink}
                copied={isCopied}
                url={window.location.href}
            />

            {!spinner && (
                <div className="loader">
                    <Loader />
                </div>
            )}

            <Footer />
        </>
    );
};

export default VideoPlayer;
