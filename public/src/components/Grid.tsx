import React from 'react';
import './grid.css';

const Grid: React.FC = () => {
    const gridSize = 20; // Size of each grid square

    const renderGridLines = () => {
        const lines = [];
        for (let i = 0; i < window.innerWidth; i += gridSize) {
            lines.push(
                <div key={`vline-${i}`} className="grid-line vertical" style={{ left: i }} />
            );
        }
        for (let j = 0; j < window.innerHeight; j += gridSize) {
            lines.push(
                <div key={`hline-${j}`} className="grid-line horizontal" style={{ top: j }} />
            );
        }
        return lines;
    };

    return (
        <div className="grid-overlay">
            {renderGridLines()}
        </div>
    );
};

export default Grid;