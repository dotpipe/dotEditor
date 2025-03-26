import React, { useState } from 'react';
import Grid from './Grid';
import Sidebar from './Sidebar';

const Editor: React.FC = () => {
    const [elements, setElements] = useState<any[]>([]);

    const addElement = (element: any) => {
        setElements([...elements, element]);
    };

    return (
        <div className="editor-container">
            <Sidebar addElement={addElement} />
            <Grid elements={elements} />
        </div>
    );
};

export default Editor;