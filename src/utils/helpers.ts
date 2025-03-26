export function calculateGridPosition(x: number, y: number, gridSize: number): { x: number; y: number } {
    return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
    };
}

export function formatData(data: any): string {
    return JSON.stringify(data, null, 2);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}