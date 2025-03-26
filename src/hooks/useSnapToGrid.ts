import { useCallback } from 'react';

const GRID_SIZE = 20; // Define the size of the grid

const useSnapToGrid = () => {
    const snapToGrid = useCallback((position) => {
        const snappedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;
        return { x: snappedX, y: snappedY };
    }, []);

    return { snapToGrid };
};

export default useSnapToGrid;