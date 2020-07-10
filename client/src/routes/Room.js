import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const Room = (props) => {
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const senders = useRef([]);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: audio, video: video })
            .then((stream) => {
                userVideo.current.srcObject = stream;
                userStream.current = stream;

                socketRef.current = io.connect('/');
                socketRef.current.emit('join room', props.match.params.roomID);
                socketRef.current.on('other user', (userID) => {
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
    }, [audio, video]);

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
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

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

    function shareScreen() {
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

    function handleToggleMic() {
        setAudio(!audio);
    }

    function handleToggleCam() {
        setVideo(!video);
    }

    function handleCopyLink(url) {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log('Copied!');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1000);
            })
            .catch((err) => {
                console.log('Something went wrong', err);
            });
    }

    return (
        <div>
            <div style={{ display: 'flex', width: '1050px', margin: 'auto' }}>
                <div>
                    <h3>User (I'm)</h3>
                    <video
                        controls
                        autoPlay
                        ref={userVideo}
                        style={{
                            border: '4px solid red',
                            height: 500,
                            width: 500,
                        }}
                    ></video>
                </div>

                <div>
                    <h3>Partner</h3>
                    <video
                        controls
                        autoPlay
                        ref={partnerVideo}
                        style={{
                            border: '4px solid blue',
                            height: 500,
                            width: 500,
                        }}
                    ></video>
                </div>
            </div>
            <div>
                <button onClick={handleToggleMic}>Microphone</button>
                <button onClick={handleToggleCam}>Camera</button>
                <button onClick={shareScreen}>Share screen</button>
            </div>
            <div>
                URL for Contact: {window.location.href}
                <button onClick={() => handleCopyLink(window.location.href)}>
                    Copy
                </button>{' '}
                {isCopied && <span>Copied!</span>}
            </div>
        </div>
    );
};

export default Room;
