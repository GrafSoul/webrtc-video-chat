export function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current
        .getTracks()
        .forEach((track) =>
            senders.current.push(
                peerRef.current.addTrack(track, userStream.current),
            ),
        );
}
