/**
 * Fetches a JSON file from the specified URL or path and returns the parsed JSON data.
 *
 * @param {string} filename - The URL or path to the JSON file to fetch.
 * @returns {Promise<any>} - A Promise that resolves to the parsed JSON data.
 */
export function getJSONFile(filename) {
    return fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error(`Error fetching JSON file ${filename}:`, error);
            throw error;
        });
}

/**
 * Fetches a text file from the specified URL or path and returns the text content.
 *
 * @param {string} filename - The URL or path to the text file to fetch.
 * @returns {Promise<string>} - A Promise that resolves to the text content of the file.
 */
export function getTextFile(filename) {
    return fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error(`Error fetching text file ${filename}:`, error);
            throw error;
        });
}

/**
 * Escapes HTML special characters in a string.
 *
 * @param {string} html - The HTML string to escape.
 * @returns {string} - The escaped HTML string.
 */
export function escapeHtml(html) {
    const text = document.createTextNode(html);
    const p = document.createElement('p');
    p.appendChild(text);
    return p.innerHTML;
}

/**
 * Fetches content from a URL and appends it to the parent element.
 *
 * @param {string} url - The URL to fetch content from.
 * @param {HTMLElement} parent - The parent element to append the fetched content to.
 */
export function fetchContent(url, parent) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const div = document.createElement("div");
            div.innerHTML = data;
            parent.appendChild(div);
        })
        .catch(error => console.error('Error fetching content:', error));
}

/**
 * Downloads a file from the specified URL.
 *
 * @param {string} url - The URL of the file to download.
 * @param {string} filename - The name to save the file as.
 */
export function downloadFile(url, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Reads a file from an input element and returns its content as a string.
 *
 * @param {HTMLInputElement} input - The input element containing the file.
 * @returns {Promise<string>} - A Promise that resolves to the content of the file.
 */
export function readFile(input) {
    return new Promise((resolve, reject) => {
        const file = input.files[0];
        if (!file) {
            reject(new Error('No file selected'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
    });
}

/**
 * Copies the content of an element to the clipboard.
 *
 * @param {string} id - The ID of the element to copy the content from.
 * @returns {boolean} - True if the content was copied successfully, false otherwise.
 */
export function copyContentById(id) {
    const element = document.getElementById(id);

    if (element) {
        const textarea = document.createElement('textarea');
        textarea.value = element.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    } else {
        alert('Element with ID ' + id + ' not found.');
        return false;
    }
}

/**
 * Converts an HTML string to a JSON object.
 *
 * @param {string} htmlString - The HTML string to convert.
 * @returns {Object} - The JSON representation of the HTML string.
 */
export function htmlToJson(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    function elementToJson(element) {
        const result = {
            tagName: element.tagName.toLowerCase(),
            attributes: {},
            children: []
        };

        for (const attr of element.attributes) {
            result.attributes[attr.name] = attr.value;
        }

        for (const child of element.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                result.children.push(elementToJson(child));
            } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                result.children.push({
                    type: 'text',
                    content: child.textContent.trim()
                });
            }
        }

        return result;
    }

    return elementToJson(doc.body.firstChild);
}

/**
 * Generates a SHA-256 hash of the given message.
 *
 * @param {string} message - The message to hash.
 * @returns {Promise<string>} - A Promise that resolves to the SHA-256 hash of the message.
 */
export function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return crypto.subtle.digest('SHA-256', data).then(hash => {
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    });
}

/**
 * Generates a nonce using SHA-256.
 *
 * @returns {Promise<string>} - A Promise that resolves to the generated nonce.
 */
export function generateNonce() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    return sha256(randomBytes.join('')).then(hash => hash.slice(0, 16));
}