import React from 'react';

const SettingsRoom = ({ settings, handleToggleSettings }) => {
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
        </div>
    );
};

export default SettingsRoom;
