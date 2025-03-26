async function saveGridData(gridData) {
    try {
        const response = await fetch('/saveJSON.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gridData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Grid data saved successfully:', result);
    } catch (error) {
        console.error('Error saving grid data:', error);
    }
}