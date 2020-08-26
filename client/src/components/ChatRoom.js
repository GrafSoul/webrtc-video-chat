import React from 'react';

const ChatRoom = ({ shareChat, handleShareChat }) => {
    return (
        <div className={['chat', shareChat ? 'active' : null].join(' ')}>
            <button
                className="btn-close"
                onClick={handleShareChat}
                title="Close"
            >
                <span className="icon icon-close"></span>
            </button>

            <h2>Chat</h2>

            <div className="chat-wrap">
                <div className="chat-container">
                    <div className="in-row">
                        <div className="in-message">yhwyerwy</div>
                    </div>

                    <div className="out-row">
                        <div className="out-message">yeryterty</div>
                    </div>
                </div>

                <form className="chat-form">
                    <textarea
                        className="chat-write"
                        placeholder="Write text here..."
                    ></textarea>
                    <button className="chat-btn">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
