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
        newElement.id = `draggable${elementCount}`;
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
            <tfoot>
                <tr>
                    <td colspan="4">
                        <button class="add-attribute-btn">+</button>
                        <button class="add-custom-attribute-btn">Custom</button>
                    </td>
                </tr>
            </tfoot>
        `;
        attributesContainer.appendChild(attributesTable);

        attributesTable.querySelector('.add-attribute-btn').addEventListener('click', () => addAttributeRow(attributesTable));
        attributesTable.querySelector('.add-custom-attribute-btn').addEventListener('click', () => addAttributeRow(attributesTable, true));

        showAttributesBtn.addEventListener('click', () => {
            const tagName = tagNameInput.value.trim().toLowerCase();
            if (tagName) {
                if (attributesContainer.style.display === 'none') {
                    attributesContainer.style.display = 'block';
                    if (attributesTable.querySelector('tbody').children.length === 0) {
                        addAttributeRow(attributesTable);
                    }
                } else {
                    attributesContainer.style.display = 'none';
                }
            } else {
                alert('Please enter a tag name.');
            }
        });

        gridContainer.appendChild(newElement);
        newElement.addEventListener('mousedown', onDragStart);
        resizeHandle.addEventListener('mousedown', onResizeStart);
        resizeRightBtn.addEventListener('click', () => resizeElement(newElement, 'right'));
        resizeDownBtn.addEventListener('click', () => resizeElement(newElement, 'down'));
        resizeLeftBtn.addEventListener('click', () => resizeElement(newElement, 'left'));
        resizeUpBtn.addEventListener('click', () => resizeElement(newElement, 'up'));
    }

    function addAttributeRow(attributesTable, isCustom = false) {
        const row = document.createElement('tr');

        const attributeCell = document.createElement('td');
        if (isCustom) {
            const customAttributeInput = document.createElement('input');
            customAttributeInput.type = 'text';
            customAttributeInput.placeholder = 'Custom...';
            attributeCell.appendChild(customAttributeInput);
        } else {
            const attributeSelect = document.createElement('select');
            const attributes = [
                'id', 'class', 'style', 'title', 'textContent', 'label', 'icon', 'sources', 'src', 'insert', 'ajax', 'ajax-limit', 'query', 'turn', 'callback', 'callback-class', 'modal', 'download', 'file', 'set', 'get', 'delete', 'x-toggle', 'directory', 'tool-tip', 'modal-tip', 'copy', 'clear-node', 'redirect', 'disabled', 'br', 'js', 'css', 'modala', 'tree-view', 'strict-json', 'plain-text', 'plain-html', 'delay', 'boxes', 'file-order', 'file-index', 'interval', 'mode', 'multiple', 'remove', 'display', 'headers', 'form-class', 'mouse', 'event', 'options'
            ];
            attributeSelect.innerHTML = attributes.map(attr => `<option value="${attr}">${attr}</option>`).join('');
            attributeCell.appendChild(attributeSelect);
        }
        row.appendChild(attributeCell);

        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
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
    
            const attributesString = attributesArray.map(item => `${item.key}: ${item.value}`).join(', ');
    
            // Collect existing style attribute if it exists
            const existingStyle = attributesString.style || '';
            const styleString = `${existingStyle} left: ${element.style.left}; top: ${element.style.top}; width: ${element.style.width}; height: ${element.style.height};`.trim();
    
            return {
                id,
                tagName,
                attributes: attributesString, // Include attributes as a single string
                style: styleString // Include style as a single string
            };
        });
    
        const json = JSON.stringify(elements, null, 2);
        downloadJson(json, 'grid-data.json');
    }
    // function saveGridData() {
    //     const elements = Array.from(gridContainer.querySelectorAll('.draggable')).map(element => {
    //         const id = element.id;
    //         const tagName = element.querySelector('.tag-name-input').value.trim().toLowerCase();
    //         const attributesTable = element.querySelector('.attributes-table');
    //         const attributesArray = Array.from(attributesTable.querySelectorAll('tbody tr')).map(row => {
    //             const cells = row.querySelectorAll('td');
    //             const attribute = cells[0].querySelector('select') ? cells[0].querySelector('select').value : cells[0].querySelector('input').value;
    //             const value = cells[1].querySelector('input').value;
    //             return { key: attribute, value: value };
    //         });
    
    //         const attributesString = attributesArray.map(item => `${item.key}: ${item.value}`).join(', ');
    
    //         return {
    //             id,
    //             tagName,
    //             attributes: attributesString, // Include attributes as a single string
    //             style: {
    //                 left: element.style.left,
    //                 top: element.style.top,
    //                 width: element.style.width,
    //                 height: element.style.height
    //             }
    //         };
    //     });
    
    //     const json = JSON.stringify(elements, null, 2);
    //     downloadJson(json, 'grid-data.json');
    // }
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

    function showAttributesModal(tagName, id, attributesTable) {
        const attributesTableContent = document.createElement('div');
        attributesTableContent.classList.add('attributes-table-content');

        const saveAttributesBtn = document.createElement('button');
        saveAttributesBtn.textContent = 'Save Attributes';
        saveAttributesBtn.classList.add('save-attributes-btn');
        saveAttributesBtn.addEventListener('click', () => {
            const selectedAttributes = Array.from(attributesTable.querySelectorAll('tbody tr')).reduce((acc, row) => {
                const cells = row.querySelectorAll('td');
                const attribute = cells[0].querySelector('select') ? cells[0].querySelector('select').value : cells[0].querySelector('input').value;
                const value = cells[1].querySelector('input').value;
                if (attribute && value) {
                    acc[attribute] = value;
                }
                return acc;
            }, {});
            attributesTable.setAttribute('data-attributes', JSON.stringify(selectedAttributes));
            attributesTable.parentElement.style.display = 'none';
        });
        attributesTableContent.appendChild(saveAttributesBtn);

        const loadAttributesBtn = document.createElement('button');
        loadAttributesBtn.textContent = 'Load Attributes';
        loadAttributesBtn.classList.add('load-attributes-btn');
        loadAttributesBtn.addEventListener('click', () => {
            // Implement load functionality here
        });
        attributesTableContent.appendChild(loadAttributesBtn);

        attributesTable.parentElement.appendChild(attributesTableContent);

        // Add the first attribute row by default
        addAttributeRow(attributesTable);
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

    function loadGridData() {
        fetch('/loadJSON.php')
        .then(response => response.json())
        .then(data => {
            gridContainer.innerHTML = '';
            data.forEach(item => {
                const newElement = document.createElement('div');
                newElement.classList.add('draggable');
                newElement.id = item.id;
                newElement.style.left = `${item.left}px`;
                newElement.style.top = `${item.top}px`;
                newElement.style.width = `${item.width}px`;
                newElement.style.height = `${item.height}px`;

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

                showAttributesBtn.addEventListener('click', () => {
                    const tagName = tagNameInput.value.trim().toLowerCase();
                    if (tagName) {
                        attributesContainer.style.display = 'block';
                    } else {
                        alert('Please enter a tag name.');
                    }
                });

                newElement.setAttribute('data-attributes', item.attributes);

                gridContainer.appendChild(newElement);
                newElement.addEventListener('mousedown', onDragStart);
                resizeHandle.addEventListener('mousedown', onResizeStart);
                resizeRightBtn.addEventListener('click', () => resizeElement(newElement, 'right'));
                resizeDownBtn.addEventListener('click', () => resizeElement(newElement, 'down'));
                resizeLeftBtn.addEventListener('click', () => resizeElement(newElement, 'left'));
                resizeUpBtn.addEventListener('click', () => resizeElement(newElement, 'up'));
            });
        })
        .catch(error => {
            console.error('Error loading grid data:', error);
        });
    }

    function previewGrid() {
        const previewWindow = window.open('', '_blank');
        const previewDocument = previewWindow.document;
        previewDocument.write('<html><head><title>Preview</title></head><body>');
        previewDocument.write(gridContainer.outerHTML);
        previewDocument.write('</body></html>');
        previewDocument.close();
    }
});