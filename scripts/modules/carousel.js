import { createElement } from './domUtils.js';

/**
 * Shifts the files to the left in a carousel.
 *
 * @param {HTMLElement|string} elem - The element or its ID.
 * @param {boolean} [auto=false] - Whether to automatically shift the files.
 * @param {number} [delay=1000] - The delay between shifts in milliseconds.
 */
export function shiftFilesLeft(elem, auto = false, delay = 1000) {
    if (typeof elem === "string") {
        elem = document.getElementById(elem);
    }

    const iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
    const index = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
    const boxes = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;
    const sources = elem.getAttribute("sources").split(";");
    const type = elem.getAttribute("type").toLowerCase();

    for (let i = 0; i < boxes; i++) {
        elem.removeChild(elem.firstChild);
        const source = sources[(i + index) % sources.length];
        const newElement = createElement(type, source, elem.getAttribute("width"), elem.getAttribute("height"));
        elem.appendChild(newElement);
    }

    elem.style.display = elem.hasAttribute("vertical") && elem.getAttribute("vertical") === "true" ? "block" : "inline-block";
    elem.setAttribute("index", (index + iter) % sources.length);

    if (auto) {
        setTimeout(() => shiftFilesLeft(elem, auto, delay), delay);
    }
}

/**
 * Shifts the files to the right in a carousel.
 *
 * @param {HTMLElement|string} elem - The element or its ID.
 * @param {boolean} [auto=false] - Whether to automatically shift the files.
 * @param {number} [delay=1000] - The delay between shifts in milliseconds.
 */
export function shiftFilesRight(elem, auto = false, delay = 1000) {
    if (typeof elem === "string") {
        elem = document.getElementById(elem);
    }

    const iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
    const index = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
    const boxes = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;
    const sources = elem.getAttribute("sources").split(";");
    const type = elem.getAttribute("type").toLowerCase();

    for (let i = 0; i < boxes; i++) {
        elem.removeChild(elem.lastChild);
        const source = sources[(i + index) % sources.length];
        const newElement = createElement(type, source, elem.getAttribute("width"), elem.getAttribute("height"));
        elem.prepend(newElement);
    }

    elem.style.display = elem.hasAttribute("vertical") && elem.getAttribute("vertical") === "true" ? "block" : "inline-block";
    elem.setAttribute("index", (index + iter) % sources.length);

    if (auto) {
        setTimeout(() => shiftFilesRight(elem, auto, delay), delay);
    }
}

/**
 * Slides the carousel in the specified direction.
 *
 * @param {HTMLElement|string} elem - The element or its ID.
 * @param {string} direction - The direction to slide ('left' or 'right').
 * @param {boolean} [auto=false] - Whether to automatically slide the files.
 * @param {number} [delay=1000] - The delay between slides in milliseconds.
 */
export function slideCarousel(elem, direction, auto = false, delay = 1000) {
    if (direction === 'left') {
        shiftFilesLeft(elem, auto, delay);
    } else if (direction === 'right') {
        shiftFilesRight(elem, auto, delay);
    } else {
        console.error(`Invalid direction: ${direction}`);
    }
}