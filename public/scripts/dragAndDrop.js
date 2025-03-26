document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const addElementBtn = document.getElementById('add-element-btn');
    const saveJsonBtn = document.getElementById('save-json-btn');
    const loadJsonBtn = document.getElementById('load-json-btn');
    const previewBtn = document.getElementById('preview-btn');
    let currentDraggable = null;
    let currentResizable = null;
    let offsetX, offsetY;
    let elementCount = 0;

    addElementBtn.addEventListener('click', addNewElement);
    saveJsonBtn.addEventListener('click', saveGridData);
    loadJsonBtn.addEventListener('click', loadGridData);
    previewBtn.addEventListener('click', previewGrid);

    function addNewElement() {
        elementCount++;
        const newElement = document.createElement('div');
        newElement.classList.add('draggable');
        newElement.style.left = '0px';
        newElement.style.top = '0px';
        newElement.style.width = '100px';
        newElement.style.height = '100px';

        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        newElement.appendChild(resizeHandle);

        const resizeRightBtn = document.createElement('button');
        resizeRightBtn.textContent = '→';
        resizeRightBtn.classList.add('resize-btn', 'resize-right');
        newElement.appendChild(resizeRightBtn);

        const resizeDownBtn = document.createElement('button');
        resizeDownBtn.textContent = '↓';
        resizeDownBtn.classList.add('resize-btn', 'resize-down');
        newElement.appendChild(resizeDownBtn);

        const resizeLeftBtn = document.createElement('button');
        resizeLeftBtn.textContent = '←';
        resizeLeftBtn.classList.add('resize-btn', 'resize-left');
        newElement.appendChild(resizeLeftBtn);

        const resizeUpBtn = document.createElement('button');
        resizeUpBtn.textContent = '↑';
        resizeUpBtn.classList.add('resize-btn', 'resize-up');
        newElement.appendChild(resizeUpBtn);

        const tagNameInput = document.createElement('input');
        tagNameInput.type = 'text';
        tagNameInput.placeholder = 'Tag Name';
        tagNameInput.classList.add('tag-name-input');
        newElement.appendChild(tagNameInput);

        const showAttributesBtn = document.createElement('button');
        showAttributesBtn.textContent = 'Details...';
        showAttributesBtn.classList.add('show-attributes-btn');
        newElement.appendChild(showAttributesBtn);

        const attributesContainer = document.createElement('div');
        attributesContainer.classList.add('attributes-container');
        attributesContainer.style.display = 'none';
        newElement.appendChild(attributesContainer);

        const attributesTable = document.createElement('table');
        attributesTable.classList.add('attributes-table');
        attributesTable.innerHTML = `
            <thead>
                <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                    <th colspan="2">Action</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        attributesContainer.appendChild(attributesTable);

        // Add the '+' and 'Custom' buttons
        addAttributeButtons(attributesContainer, attributesTable);

        // showAttributesBtn.addEventListener('click', () => {
        //     const tagName = newElement;
        //     console.log('Tag Name:', tagName);
        //     if (tagName) {
        //         // Bring the parent box to the top
        //         bringToFront(newElement);
            //     console.log('Tag Name:', tagName);
            //     // Toggle the visibility of the attributes container
            //     if (attributesContainer.style.display === 'none' || attributesContainer.style.display === '') {
            //         attributesContainer.style.display = 'block';
            //         attributesContainer.style.zIndex = 3000; // Ensure the attributes container is on top
        
            //         // Position the attributes container relative to the parent element
            //         const rect = newElement.getBoundingClientRect();
            //         attributesContainer.style.left = `${rect.right + 10}px`; // Position to the right of the element
            //         attributesContainer.style.top = `${rect.top}px`; // Align vertically with the element
            //     } else {
            //         attributesContainer.style.display = 'none';
            //     }
            // } else {
            //     alert('Please enter a tag name.');
            // }
        // });
        

        gridContainer.appendChild(newElement);
        newElement.addEventListener('mousedown', () => onDragStart);
        newElement.addEventListener('click', () => bringToFront(newElement));
        resizeRightBtn.addEventListener('click', () => resizeElement(newElement, 'right'));
        resizeDownBtn.addEventListener('click', () => resizeElement(newElement, 'down'));
        resizeLeftBtn.addEventListener('click', () => resizeElement(newElement, 'left'));
        resizeUpBtn.addEventListener('click', () => resizeElement(newElement, 'up'));
    }
    
    function bringToFront(element) {
        // Reset the zIndex of all elements
        const allElements = document.querySelectorAll('*');
        console.log('All Elements:', allElements);
        allElements.forEach(el => {
                el.style.zIndex = el.style.zindex - 1; // Reset to default
        });
        console.log('Element:', element);
        // Set the clicked element to a high zIndex
        element.style.zIndex = 2000;
    }

    function addAttributeRow(attributesTable, isCustom = false, key = '', value = '') {
        const row = document.createElement('tr');

        const attributeCell = document.createElement('td');
        if (isCustom) {
            // Create a text input for custom attributes
            const customAttributeInput = document.createElement('input');
            customAttributeInput.type = 'text';
            customAttributeInput.placeholder = 'Custom Attribute';
            customAttributeInput.value = key;
            attributeCell.appendChild(customAttributeInput);
        } else {
            // Create a dropdown for predefined attributes
            const attributeSelect = document.createElement('select');
            const attributesList = [
                'id', 'class', 'style', 'title', 'textContent', 'label', 'icon', 'sources', 'src', 'insert', 'ajax',
                'ajax-limit', 'query', 'turn', 'callback', 'callback-class', 'modal', 'download', 'file', 'set', 'get',
                'delete', 'x-toggle', 'directory', 'tool-tip', 'modal-tip', 'copy', 'clear-node', 'redirect', 'disabled',
                'br', 'js', 'css', 'modala', 'tree-view', 'strict-json', 'plain-text', 'plain-html', 'delay', 'boxes',
                'file-order', 'file-index', 'interval', 'mode', 'multiple', 'remove', 'display', 'headers', 'form-class',
                'mouse', 'event', 'options'
            ];
            attributeSelect.innerHTML = attributesList.map(attr => `<option value="${attr}">${attr}</option>`).join('');
            attributeSelect.value = key;
            attributeCell.appendChild(attributeSelect);
        }
        row.appendChild(attributeCell);

        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Value';
        valueInput.value = value;
        valueCell.appendChild(valueInput);
        row.appendChild(valueCell);

        const lockCell = document.createElement('td');
        const toggleLockBtn = document.createElement('button');
        toggleLockBtn.textContent = '🔒';
        toggleLockBtn.addEventListener('click', () => {
            const isLocked = toggleLockBtn.textContent === '🔒';
            toggleLockBtn.textContent = isLocked ? '🔓' : '🔒';
            if (isCustom) {
                attributeCell.querySelector('input').disabled = isLocked;
            } else {
                attributeCell.querySelector('select').disabled = isLocked;
            }
            valueInput.disabled = isLocked;
        });
        lockCell.appendChild(toggleLockBtn);
        row.appendChild(lockCell);

        const removeCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑️';
        removeBtn.addEventListener('click', () => {
            row.remove();
        });
        removeCell.appendChild(removeBtn);
        row.appendChild(removeCell);

        attributesTable.querySelector('tbody').appendChild(row);
    }

    function addAttributeButtons(attributesContainer, attributesTable) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('attribute-buttons');

        // Add the '+' button
        const addAttributeBtn = document.createElement('button');
        addAttributeBtn.textContent = '+';
        addAttributeBtn.addEventListener('click', () => addAttributeRow(attributesTable, false));
        buttonContainer.appendChild(addAttributeBtn);

        // Add the 'Custom' button
        const addCustomAttributeBtn = document.createElement('button');
        addCustomAttributeBtn.textContent = 'Custom';
        addCustomAttributeBtn.addEventListener('click', () => addAttributeRow(attributesTable, true));
        buttonContainer.appendChild(addCustomAttributeBtn);

        attributesContainer.appendChild(buttonContainer);
    }

    function loadGridData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const data = JSON.parse(e.target.result);
                    console.log(data);
                    populateGridFromJSON(data);
                };
                reader.readAsText(file);
            }
        });
        input.click();
    }
    function addAttributeRow(attributesTable, isCustom = false, key = '', value = '') {
        const row = document.createElement('tr');

        const attributeCell = document.createElement('td');
        if (isCustom) {
            // Create a text input for custom attributes
            const customAttributeInput = document.createElement('input');
            customAttributeInput.type = 'text';
            customAttributeInput.placeholder = 'Custom Attribute';
            customAttributeInput.value = key;
            attributeCell.appendChild(customAttributeInput);
        } else {
            // Create a dropdown for predefined attributes
            const attributeSelect = document.createElement('select');
            const attributesList = [
                'id', 'class', 'style', 'title', 'textContent', 'label', 'icon', 'sources', 'src', 'insert', 'ajax',
                'ajax-limit', 'query', 'turn', 'callback', 'callback-class', 'modal', 'download', 'file', 'set', 'get',
                'delete', 'x-toggle', 'directory', 'tool-tip', 'modal-tip', 'copy', 'clear-node', 'disabled',
                'br', 'js', 'css', 'modal', 'strict-json', 'plain-text', 'plain-html', 'delay', 'boxes', 'node',
                'file-order', 'file-index', 'interval', 'mode', 'remove', 'display', 'headers', 'form-class',
                'mouse', 'event', 'options'
            ];
            attributeSelect.innerHTML = attributesList.map(attr => `<option value="${attr}">${attr}</option>`).join('');
            attributeSelect.value = key;
            attributeCell.appendChild(attributeSelect);
        }
        row.appendChild(attributeCell);

        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Value';
        valueInput.value = value;
        valueCell.appendChild(valueInput);
        row.appendChild(valueCell);

        const lockCell = document.createElement('td');
        const toggleLockBtn = document.createElement('button');
        toggleLockBtn.textContent = '🔒';
        toggleLockBtn.addEventListener('click', () => {
            const isLocked = toggleLockBtn.textContent === '🔒';
            toggleLockBtn.textContent = isLocked ? '🔓' : '🔒';
            if (isCustom) {
                attributeCell.querySelector('input').disabled = isLocked;
            } else {
                attributeCell.querySelector('select').disabled = isLocked;
            }
            valueInput.disabled = isLocked;
        });
        lockCell.appendChild(toggleLockBtn);
        row.appendChild(lockCell);

        const removeCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑️';
        removeBtn.addEventListener('click', () => {
            row.remove();
        });
        removeCell.appendChild(removeBtn);
        row.appendChild(removeCell);

        attributesTable.querySelector('tbody').appendChild(row);
    }

    function addAttributeRow(attributesTable, isCustom = false, key = '', value = '') {
        const row = document.createElement('tr');

        const attributeCell = document.createElement('td');
        if (isCustom) {
            // Create a text input for custom attributes
            const customAttributeInput = document.createElement('input');
            customAttributeInput.type = 'text';
            customAttributeInput.placeholder = 'Custom Attribute';
            customAttributeInput.value = key;
            attributeCell.appendChild(customAttributeInput);
        } else {
            // Create a dropdown for predefined attributes
            const attributeSelect = document.createElement('select');
            const attributesList = [
                'id', 'class', 'style', 'title', 'textContent', 'label', 'icon', 'sources', 'src', 'insert', 'ajax',
                'ajax-limit', 'query', 'turn', 'callback', 'callback-class', 'modal', 'download', 'file', 'set', 'get',
                'delete', 'x-toggle', 'directory', 'tool-tip', 'modal-tip', 'copy', 'clear-node', 'redirect', 'disabled',
                'br', 'js', 'css', 'modala', 'tree-view', 'strict-json', 'plain-text', 'plain-html', 'delay', 'boxes',
                'file-order', 'file-index', 'interval', 'mode', 'multiple', 'remove', 'display', 'headers', 'form-class',
                'mouse', 'event', 'options'
            ];
            attributeSelect.innerHTML = attributesList.map(attr => `<option value="${attr}">${attr}</option>`).join('');
            attributeSelect.value = key;
            attributeCell.appendChild(attributeSelect);
        }
        row.appendChild(attributeCell);

        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = 'Value';
        valueInput.value = value;
        valueCell.appendChild(valueInput);
        row.appendChild(valueCell);

        const lockCell = document.createElement('td');
        const toggleLockBtn = document.createElement('button');
        toggleLockBtn.textContent = '🔒';
        toggleLockBtn.addEventListener('click', () => {
            const isLocked = toggleLockBtn.textContent === '🔒';
            toggleLockBtn.textContent = isLocked ? '🔓' : '🔒';
            if (isCustom) {
                attributeCell.querySelector('input').disabled = isLocked;
            } else {
                attributeCell.querySelector('select').disabled = isLocked;
            }
            valueInput.disabled = isLocked;
        });
        lockCell.appendChild(toggleLockBtn);
        row.appendChild(lockCell);

        const removeCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑️';
        removeBtn.addEventListener('click', () => {
            row.remove();
        });
        removeCell.appendChild(removeBtn);
        row.appendChild(removeCell);

        attributesTable.querySelector('tbody').appendChild(row);
    }
    let lastZIndex = 1; // Keep track of the last used zIndex

    function bringToFront(element) {
        // Reset the zIndex of all elements
        const allElements = document.querySelectorAll('.draggable');
        allElements.forEach(el => {
            if (el !== element) {
                el.style.zIndex = ''; // Reset to default
            }
        });

        // Set the clicked element to a high zIndex
        element.style.zIndex = 2000;
    }

    function addAttributeButtons(attributesContainer, attributesTable) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('attribute-buttons');

        // Add the '+' button
        const addAttributeBtn = document.createElement('button');
        addAttributeBtn.textContent = '+';
        addAttributeBtn.addEventListener('click', () => addAttributeRow(attributesTable, false));
        buttonContainer.appendChild(addAttributeBtn);

        // Add the 'Custom' button
        const addCustomAttributeBtn = document.createElement('button');
        addCustomAttributeBtn.textContent = 'Custom';
        addCustomAttributeBtn.addEventListener('click', () => addAttributeRow(attributesTable, true));
        buttonContainer.appendChild(addCustomAttributeBtn);

        attributesContainer.appendChild(buttonContainer);
    }

    function populateGridFromJSON(data) {
        gridContainer.innerHTML = '';
        data.forEach(item => {
            const newElement = document.createElement('div');
            newElement.classList.add('draggable');
            newElement.id = item.id;

            // Apply styles
            newElement.style.left = item.left;
            newElement.style.top = item.top;
            newElement.style.width = item.width;
            newElement.style.height = item.height;

            const resizeHandle = document.createElement('div');
            resizeHandle.classList.add('resize-handle');
            newElement.appendChild(resizeHandle);

            const resizeRightBtn = document.createElement('button');
            resizeRightBtn.textContent = '→';
            resizeRightBtn.classList.add('resize-btn', 'resize-right');
            newElement.appendChild(resizeRightBtn);

            const resizeDownBtn = document.createElement('button');
            resizeDownBtn.textContent = '↓';
            resizeDownBtn.classList.add('resize-btn', 'resize-down');
            newElement.appendChild(resizeDownBtn);

            const resizeLeftBtn = document.createElement('button');
            resizeLeftBtn.textContent = '←';
            resizeLeftBtn.classList.add('resize-btn', 'resize-left');
            newElement.appendChild(resizeLeftBtn);

            const resizeUpBtn = document.createElement('button');
            resizeUpBtn.textContent = '↑';
            resizeUpBtn.classList.add('resize-btn', 'resize-up');
            newElement.appendChild(resizeUpBtn);

            const tagNameInput = document.createElement('input');
            tagNameInput.type = 'text';
            tagNameInput.placeholder = 'Tag Name';
            tagNameInput.classList.add('tag-name-input');
            tagNameInput.value = item.tagName;
            newElement.appendChild(tagNameInput);

            const showAttributesBtn = document.createElement('button');
            showAttributesBtn.textContent = 'Details...';
            showAttributesBtn.classList.add('show-attributes-btn');
            newElement.appendChild(showAttributesBtn);

            const attributesContainer = document.createElement('div');
            attributesContainer.classList.add('attributes-container');
            attributesContainer.style.display = 'none';
            newElement.appendChild(attributesContainer);

            const attributesTable = document.createElement('table');
            attributesTable.classList.add('attributes-table');
            attributesTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                        <th colspan="2">Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            attributesContainer.appendChild(attributesTable);

            // Add the '+' and 'Custom' buttons
            addAttributeButtons(attributesContainer, attributesTable);

            showAttributesBtn.addEventListener('click', () => {
                const tagName = tagNameInput.value.trim().toLowerCase();
                if (tagName) {
                    // Toggle the visibility of the attributes container
                    if (attributesContainer.style.display === 'none' || attributesContainer.style.display === '') {
                        attributesContainer.style.display = 'block';
                    } else {
                        attributesContainer.style.display = 'none';
                    }
                } else {
                    alert('Please enter a tag name.');
                }
            });

            // Add id attribute first
            if (item.id) {
                addAttributeRow(attributesTable, false, 'id', item.id);
            }

            // Add other attributes
            Object.keys(item).forEach(key => {
                if (key !== 'id' && key !== 'tagName' && key !== 'left' && key !== 'top' && key !== 'width' && key !== 'height') {
                    addAttributeRow(attributesTable, !attributesList.includes(key), key, item[key]);
                }
            });

            gridContainer.appendChild(newElement);
            newElement.addEventListener('mousedown', onDragStart);
            resizeHandle.addEventListener('mousedown', onResizeStart);
            resizeRightBtn.addEventListener('click', () => resizeElement(newElement, 'right'));
            resizeDownBtn.addEventListener('click', () => resizeElement(newElement, 'down'));
            resizeLeftBtn.addEventListener('click', () => resizeElement(newElement, 'left'));
            resizeUpBtn.addEventListener('click', () => resizeElement(newElement, 'up'));
        });
    }

    function saveGridData() {
        const elements = Array.from(gridContainer.querySelectorAll('.draggable')).map(element => {
            const id = element.id;
            const tagName = element.querySelector('.tag-name-input').value.trim().toLowerCase();
            const attributesTable = element.querySelector('.attributes-table');
            const attributesArray = Array.from(attributesTable.querySelectorAll('tbody tr')).map(row => {
                const cells = row.querySelectorAll('td');
                const attribute = cells[0].querySelector('select') ? cells[0].querySelector('select').value : cells[0].querySelector('input').value;
                const value = cells[1].querySelector('input').value;
                return { key: attribute, value: value };
            });

            const attributes = attributesArray.reduce((acc, item) => {
                acc[item.key] = item.value;
                return acc;
            }, {});

            return {
                id,
                tagName,
                left: element.style.left,
                top: element.style.top,
                width: element.style.width,
                height: element.style.height,
                ...attributes // Spread attributes directly into the object
            };
        });

        const json = JSON.stringify(elements, null, 2);
        downloadJson(json, 'grid-data.json');
    }

    function downloadJson(json, filename) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function onDragStart(event) {
        if (event.target.classList.contains('resize-handle') || event.target.classList.contains('resize-btn')) return;

        currentDraggable = event.target;
        offsetX = event.clientX - currentDraggable.getBoundingClientRect().left;
        offsetY = event.clientY - currentDraggable.getBoundingClientRect().top;
        currentDraggable.classList.add('moving');

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDragEnd);
    }

    function onDrag(event) {
        if (!currentDraggable) return;

        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        currentDraggable.style.left = `${x}px`;
        currentDraggable.style.top = `${y}px`;

        checkOverlap(currentDraggable);
    }

    function onDragEnd(event) {
        if (!currentDraggable) return;

        const gridRect = gridContainer.getBoundingClientRect();
        const x = event.clientX - offsetX - gridRect.left;
        const y = event.clientY - offsetY - gridRect.top;

        const snappedX = Math.round(x / 100) * 100;
        const snappedY = Math.round(y / 100) * 100;

        currentDraggable.style.left = `${snappedX}px`;
        currentDraggable.style.top = `${snappedY}px`;

        currentDraggable.classList.remove('moving');
        currentDraggable.classList.remove('overlapping');

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onDragEnd);
        currentDraggable = null;
    }

    function onResizeStart(event) {
        currentResizable = event.target.parentElement;
        offsetX = event.clientX;
        offsetY = event.clientY;

        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', onResizeEnd);
    }

    function onResize(event) {
        if (!currentResizable) return;

        const dx = event.clientX - offsetX;
        const dy = event.clientY - offsetY;

        const newWidth = Math.max(100, currentResizable.offsetWidth + dx);
        const newHeight = Math.max(100, currentResizable.offsetHeight + dy);

        currentResizable.style.width = `${newWidth}px`;
        currentResizable.style.height = `${newHeight}px`;

        offsetX = event.clientX;
        offsetY = event.clientY;

        checkOverlap(currentResizable);
    }

    function onResizeEnd(event) {
        if (!currentResizable) return;

        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', onResizeEnd);
        currentResizable = null;
    }

    function resizeElement(element, direction) {
        const gridSize = 100;
        if (direction === 'right') {
            element.style.width = `${element.offsetWidth + gridSize}px`;
        } else if (direction === 'down') {
            element.style.height = `${element.offsetHeight + gridSize}px`;
        } else if (direction === 'left') {
            element.style.width = `${Math.max(gridSize, element.offsetWidth - gridSize)}px`;
        } else if (direction === 'up') {
            element.style.height = `${Math.max(gridSize, element.offsetHeight - gridSize)}px`;
        }

        checkOverlap(element);
    }

    function checkOverlap(draggable) {
        let isOverlapping = false;
        const draggables = document.querySelectorAll('.draggable');
        draggables.forEach(other => {
            if (other !== draggable) {
                const rect1 = draggable.getBoundingClientRect();
                const rect2 = other.getBoundingClientRect();

                if (!(rect1.right < rect2.left ||
                    rect1.left > rect2.right ||
                    rect1.bottom < rect2.top ||
                    rect1.top > rect2.bottom)) {
                    isOverlapping = true;
                }
            }
        });

        if (isOverlapping) {
            draggable.classList.add('overlapping');
        } else {
            draggable.classList.remove('overlapping');
        }
    }

    function previewGrid() {
        const previewWindow = window.open('', '_blank');
        const previewDocument = previewWindow.document;
        previewDocument.write('<html><head><title>Preview</title></head><body>');
        previewDocument.write(gridContainer.outerHTML);
        previewDocument.write('</body></html>');
        previewDocument.close();
    }

    const attributesList = [
        'id', 'class', 'style', 'title', 'textContent', 'label', 'icon', 'sources', 'src', 'insert', 'ajax', 'ajax-limit', 'query', 'turn', 'callback', 'callback-class', 'modal', 'download', 'file', 'set', 'get', 'delete', 'x-toggle', 'directory', 'tool-tip', 'modal-tip', 'copy', 'clear-node', 'redirect', 'disabled', 'br', 'js', 'css', 'modala', 'tree-view', 'strict-json', 'plain-text', 'plain-html', 'delay', 'boxes', 'file-order', 'file-index', 'interval', 'mode', 'multiple', 'remove', 'display', 'headers', 'form-class', 'mouse', 'event', 'options'
    ];
});