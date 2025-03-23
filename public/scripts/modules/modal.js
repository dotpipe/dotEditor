import { getJSONFile, escapeHtml, fetchContent } from './fileUtils.js';
import { addCss, addJs, addMetaTag } from './domUtils.js';

/**
 * Recursively creates HTML elements based on a JSON object and appends them to the specified parent element.
 *
 * @param {Object} value - A JSON object containing information about the HTML elements to create.
 * @param {string|HTMLElement} tempTag - The ID of the HTML element to insert the created elements into, or the element itself.
 * @param {HTMLElement} [root] - The root element for the created elements.
 * @param {string} [id] - The ID of the created elements.
 * @returns {HTMLElement} The parent element with the created elements appended.
 */
export function modala(value, tempTag, root, id) {
    if (typeof tempTag === "string") {
        tempTag = document.getElementById(tempTag);
    }
    if (!root) root = tempTag;
    if (!tempTag || !value) {
        console.error("Invalid reference or value");
        return;
    }

    const temp = document.createElement(value.tagname || "div");

    if (value.header && typeof value.header === "object") {
        modalaHead(value.header);
        addMetaTag();
    }

    Object.entries(value).forEach(([k, v]) => {
        if (k.toLowerCase() === "header") return;
        if (k.toLowerCase() === "buttons" && Array.isArray(v)) {
            createButtons(v, temp);
        } else if (typeof v === "object") {
            modala(v, temp, root, id);
        } else {
            handleAttributes(k, v, temp, tempTag);
        }
    });

    tempTag.appendChild(temp);
    domContentLoad();

    // Save the grid data to the database
    saveGridData(value);

    return tempTag;
}

/**
 * Recursively creates HTML elements based on a JSON object and appends them to the document head.
 *
 * @param {Object} value - A JSON object containing information about the HTML elements to create.
 * @param {string} value.tagname - The tag name of the HTML element to create.
 * @param {Object} [value[key]] - Additional properties of the HTML element, such as attributes, text content, or nested elements.
 * @returns {HTMLElement} The created HTML element.
 */
export function modalaHead(value) {
    if (!value) {
        console.error("Invalid reference or value");
        return;
    }

    const temp = document.createElement(value.tagname || "div");

    Object.entries(value).forEach(([k, v]) => {
        if (typeof v === "object") {
            modalaHead(v);
        } else {
            handleHeadAttributes(k, v, temp);
        }
    });

    return temp;
}

/**
 * Handles various attributes for the `modala` function.
 *
 * @param {string} key - The attribute key.
 * @param {string} value - The attribute value.
 * @param {HTMLElement} element - The element to set the attribute on.
 * @param {HTMLElement} tempTag - The parent element.
 */
function handleAttributes(key, value, element, tempTag) {
    switch (key.toLowerCase()) {
        case "br":
            addBreaks(value, element);
            break;
        case "select":
            createSelect(value, element);
            break;
        case "options":
            if (element.tagName.toLowerCase() === "select") {
                addOptions(value, element);
            }
            break;
        case "sources":
            if (["card", "carousel"].includes(element.tagName.toLowerCase())) {
                addSources(value, element);
            }
            break;
        case "css":
            addCss(value, tempTag);
            break;
        case "js":
            addJs(value, tempTag);
            break;
        case "modal":
            modalList(value);
            break;
        case "html":
        case "php":
            fetchContent(value, tempTag);
            break;
        case "boxes":
            element.setAttribute("boxes", value);
            break;
        case "style":
            element.style.cssText = value;
            break;
        default:
            if (!Number(key) && !["tagname", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase())) {
                element.setAttribute(key, value);
            } else if (!Number(key) && ["textcontent", "innerhtml", "innertext"].includes(key.toLowerCase())) {
                const val = value.replace(/\r?\n/g, "<br>");
                if (key.toLowerCase() === "textcontent") {
                    element.textContent = val;
                } else if (key.toLowerCase() === "innerhtml") {
                    element.innerHTML = val;
                } else {
                    element.innerText = val;
                }
            }
            break;
    }
}

/**
 * Handles various attributes for the `modalaHead` function.
 *
 * @param {string} key - The attribute key.
 * @param {string} value - The attribute value.
 * @param {HTMLElement} element - The element to set the attribute on.
 */
function handleHeadAttributes(key, value, element) {
    switch (key.toLowerCase()) {
        case "title":
            const title = document.createElement("title");
            title.innerText = value;
            document.head.appendChild(title);
            break;
        case "css":
            addCss(value, document.head);
            break;
        case "js":
            addJs(value, document.head);
            break;
        case "modal":
            fetchContent(value, document.head);
            break;
        default:
            if (!Number(key) && !["tagname", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase())) {
                element.setAttribute(key, value);
            } else if (!Number(key) && ["textcontent", "innerhtml", "innertext"].includes(key.toLowerCase())) {
                const val = value.replace(/\r?\n/g, "<br>");
                if (key.toLowerCase() === "textcontent") {
                    element.textContent = val;
                } else if (key.toLowerCase() === "innerhtml") {
                    element.innerHTML = val;
                } else {
                    element.innerText = val;
                }
            }
            break;
    }
}

/**
 * Creates buttons based on a JSON array and appends them to the specified parent element.
 *
 * @param {Array} buttons - An array of JSON objects containing information about the buttons to create.
 * @param {HTMLElement} parent - The parent element to append the buttons to.
 */
function createButtons(buttons, parent) {
    const buttonContainer = document.createElement("div");
    buttons.forEach(buttonData => {
        const button = document.createElement("input");
        button.type = "button";
        Object.entries(buttonData).forEach(([key, val]) => {
            if (["text", "value", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase())) {
                button.value = escapeHtml(val);
            } else {
                button.setAttribute(key, val);
            }
        });
        buttonContainer.appendChild(button);
    });
    parent.appendChild(buttonContainer);
}

/**
 * Adds the specified number of <br> elements to the parent element.
 *
 * @param {number} count - The number of <br> elements to add.
 * @param {HTMLElement} parent - The parent element to append the <br> elements to.
 */
function addBreaks(count, parent) {
    for (let i = 0; i < count; i++) {
        parent.appendChild(document.createElement("br"));
    }
}

/**
 * Creates a <select> element and appends options to it.
 *
 * @param {Object} options - A JSON object containing information about the options to create.
 * @param {HTMLElement} parent - The parent element to append the <select> element to.
 */
function createSelect(options, parent) {
    const select = document.createElement("select");
    parent.appendChild(select);
    modala(options, select);
}

/**
 * Adds options to a <select> element.
 *
 * @param {string} options - A string containing options separated by semicolons.
 * @param {HTMLElement} select - The <select> element to append the options to.
 */
function addOptions(options, select) {
    const optsArray = options.split(";");
    optsArray.forEach(option => {
        const [text, value] = option.split(":");
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = text;
        select.appendChild(opt);
    });
}

/**
 * Adds sources (e.g., images, audio, video) to the parent element.
 *
 * @param {string} sources - A string containing sources separated by semicolons.
 * @param {HTMLElement} parent - The parent element to append the sources to.
 */
function addSources(sources, parent) {
    const optsArray = sources.split(";");
    optsArray.forEach(source => {
        const type = parent.getAttribute("type");
        let element;
        switch (type) {
            case "img":
                element = document.createElement("img");
                element.src = source;
                element.width = parent.getAttribute("width");
                element.height = parent.getAttribute("height");
                element.style.display = "hidden";
                break;
            case "audio":
            case "video":
                element = document.createElement("source");
                element.src = source;
                element.width = parent.getAttribute("width");
                element.height = parent.getAttribute("height");
                element.type = `${type}/${source.split('.').pop()}`;
                element.controls = parent.getAttribute("controls") !== "false";
                break;
            case "modal":
                modalList(source);
                break;
            case "html":
            case "php":
                fetchContent(source, parent);
                break;
        }
        parent.appendChild(element);
    });
}

/**
 * Displays a modal dialog with content from a JSON file.
 *
 * @param {string} filename - The URL or path to the JSON file containing the modal content.
 * @param {string|HTMLElement} tagId - The ID of the HTML element to insert the modal into, or the element itself.
 */
export function modal(filename, tagId) {
    if (typeof tagId === "string") {
        tagId = document.getElementById(tagId);
    }
    getJSONFile(filename).then(res => {
        modala(res, tagId);
    }).catch(error => {
        console.error(`Error fetching modal content from ${filename}:`, error);
    });
}

/**
 * Displays a list of modals from a JSON file.
 *
 * @param {string} filenames - A string containing one or more filenames separated by semicolons. Each filename can optionally have a colon-separated target element ID.
 * @example
 * modalList('modal.json:modal-container.another-container;another-modal.json:another-target');
 */
export function modalList(filenames) {
    const files = filenames.split(";");
    files.forEach(file => {
        const [filename, targets] = file.split(":");
        if (targets) {
            targets.split(".").forEach(target => {
                modal(filename, target);
            });
        } else {
            modal(filename, null);
        }
    });
}

/**
 * Displays a modal card with content from a JSON file.
 *
 * @param {string} filename - The URL or path to the JSON file containing the modal content.
 * @param {number|boolean} x_center - The x-coordinate or whether to center horizontally.
 * @param {number|boolean} y_center - The y-coordinate or whether to center vertically.
 * @param {number} duration - The duration to display the modal card.
 * @param {number} zindex - The z-index of the modal card.
 */
export function modalCard(filename, x_center = false, y_center = false, duration = -1, zindex = 100) {
    const copied = document.createElement("div");
    copied.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    copied.style.padding = "10px";
    copied.style.textAlign = "center";
    copied.style.backgroundColor = "white";
    copied.style.position = "absolute";
    let x_pos = 0;
    if (typeof x_center === 'boolean' && x_center) x_pos = (document.body.offsetWidth - copied.style.width) / 2;
    else if (typeof x_center === 'boolean' && !x_center) x_pos = 0;
    else x_pos = x_center;
    copied.style.left = x_pos + "px";
    let y_pos = 0;
    if (typeof y_center === 'boolean' && y_center) y_pos = window.scrollY + Math.abs((window.innerHeight / 2) - copied.style.height / 2);
    else if (typeof y_center === 'boolean' && !y_center) y_pos = 0;
    else y_pos = y_center;
    copied.style.top = y_pos + "px";
    copied.style.zIndex = zindex;
    modal(filename, copied);
    document.body.appendChild(copied);

    if (duration > -1) {
        setTimeout(() => {
            document.body.removeChild(copied);
        }, duration);
    }
}

/**
 * Displays a text card with the specified text.
 *
 * @param {string} text - The text to display.
 * @param {string} id - The ID of the text card.
 * @param {string} classes - The classes to apply to the text card.
 * @param {number|boolean} x_center - The x-coordinate or whether to center horizontally.
 * @param {number|boolean} y_center - The y-coordinate or whether to center vertically.
 * @param {number} duration - The duration to display the text card.
 * @param {number} zindex - The z-index of the text card.
 */
export function textCard(text, id = "", classes = "", x_center = false, y_center = false, duration = -1, zindex = 100) {
    const copied = document.createElement("div");
    copied.id = id;
    if (classes) copied.classList.add(classes);
    copied.style.padding = "10px";
    copied.style.textAlign = "center";
    copied.style.backgroundColor = "white";
    copied.style.position = "absolute";
    let x_pos = 0;
    if (typeof x_center === 'boolean' && x_center) x_pos = (document.body.offsetWidth - copied.style.width) / 2;
    else if (typeof x_center === 'boolean' && !x_center) x_pos = 0;
    else x_pos = x_center;
    copied.style.left = x_pos + "px";
    copied.style.zIndex = zindex;
    copied.textContent = text;
    let y_pos = 0;
    if (typeof y_center === 'boolean' && y_center) y_pos = window.scrollY + Math.abs((window.innerHeight / 2) - copied.style.height / 2);
    else if (typeof y_center === 'boolean' && !y_center) y_pos = 0;
    else y_pos = y_center;
    copied.style.top = y_pos + "px";
    document.body.appendChild(copied);

    if (duration > -1) {
        setTimeout(() => {
            document.body.removeChild(copied);
        }, duration);
    }
}