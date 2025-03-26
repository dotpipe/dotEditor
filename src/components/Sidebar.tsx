import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Editor Tools</h2>
            <button>Add Element</button>
            <button>Change Properties</button>
            <button>Delete Element</button>
            <button>Undo</button>
            <button>Redo</button>
        </div>
    );
};

export default Sidebar;