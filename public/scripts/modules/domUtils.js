import { escapeHtml } from './fileUtils.js';

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
 * Adds a CSS link to the parent element.
 *
 * @param {string} href - The URL or path to the CSS file.
 * @param {HTMLElement} parent - The parent element to append the CSS link to.
 */
export function addCss(href, parent) {
    const link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    parent.appendChild(link);
}

/**
 * Adds a JavaScript script to the parent element.
 *
 * @param {string} src - The URL or path to the JavaScript file.
 * @param {HTMLElement} parent - The parent element to append the JavaScript script to.
 */
export function addJs(src, parent) {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    parent.appendChild(script);
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
 * Adds a meta tag for Content Security Policy to the document head.
 */
export function addMetaTag() {
    const meta = document.createElement("meta");
    meta.content = "script-src-elem 'self'; img-src 'self'; style-src 'self'; child-src 'none'; object-src 'none'";
    meta.httpEquiv = "Content-Security-Policy";
    document.head.appendChild(meta);
}

/**
 * Creates an HTML element based on the type and source.
 *
 * @param {string} type - The type of the element (e.g., 'img', 'audio', 'video').
 * @param {string} source - The source URL or path for the element.
 * @param {string} width - The width of the element.
 * @param {string} height - The height of the element.
 * @returns {HTMLElement} The created element.
 */
export function createElement(type, source, width, height) {
    let newElement;

    switch (type) {
        case 'audio':
        case 'video':
            newElement = document.createElement(type);
            newElement.src = source;
            newElement.width = width;
            newElement.height = height;
            newElement.controls = true;
            break;
        case 'modal':
            modalList(source);
            break;
        case 'php':
        case 'html':
            fetch(source)
                .then(response => response.text())
                .then(data => {
                    const div = document.createElement("div");
                    div.innerHTML = data;
                    document.body.appendChild(div);
                });
            break;
        default:
            newElement = document.createElement(type);
            newElement.src = source;
            newElement.width = width;
            newElement.height = height;
            break;
    }

    return newElement;
}

/**
 * Sets timers for elements.
 *
 * @param {HTMLElement} target - The target element.
 */
export function setTimers(target) {
    const delay = target.getAttribute("delay");
    if (target.classList.contains("time-inactive") && target.classList.contains("time-active")) {
        target.classList.toggle("time-active");
        return;
    } else if (target.classList.contains("time-active")) {
    } else if (target.classList.contains("time-inactive")) {
    } else {
        target.classList.toggle("time-inactive");
    }

    setTimeout(function () {
        pipes(target);
        setTimers(target);
    }, delay);
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
 * Handles DOM content load and initializes pipes.
 *
 * @param {boolean} [again=false] - Whether to reload the content.
 */
export function domContentLoad(again = false) {
    const doc_set = document.getElementsByTagName("pipe");
    if (!again) {
        Array.from(doc_set).forEach(function (elem) {
            if (elem.classList.contains("pipe-active")) return;
            elem.classList.toggle("pipe-active");
            pipes(elem);
        });
    }

    const elementsArray_time = document.getElementsByTagName("timed");
    Array.from(elementsArray_time).forEach(function (elem) {
        if (elem.classList.contains("time-inactive")) return;
        if (elem.classList.contains("time-active")) {
            auto = true;
            setTimers(elem);
        } else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
    });

    const elementsArray_dyn = document.getElementsByTagName("dyn");
    Array.from(elementsArray_dyn).forEach(function (elem) {
        if (elem.classList.contains("disabled")) return;
        elem.classList.toggle("disabled");
    });

    const elements_Carousel = document.getElementsByTagName("carousel");
    Array.from(elements_Carousel).forEach(function (elem) {
        if (elem.classList.contains("time-inactive")) return;
        if (elem.classList.contains("time-active")) {
            auto = true;
            setTimers(elem);
        } else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
        setTimeout(carousel(elem, auto), elem.getAttribute("delay"));
    });

    const elementsArray_link = document.getElementsByTagName("lnk");
    Array.from(elementsArray_link).forEach(function (elem) {
        if (elem.classList.contains("disabled")) return;
        elem.classList.toggle("disabled");
    });

    const elements_mouse = document.querySelectorAll(".mouse");
    console.log(elements_mouse.length);
    Array.from(elements_mouse).forEach(function (elemv) {
        console.log(elemv);
        if (elemv.hasAttribute("tool-tip")) {
            console.log(elemv.getAttribute("modal-tip") + "...");
            const eve = elemv.getAttribute("event");
            let rv = ['mouseover'];
            if (eve) {
                rv = eve.split(";");
            }
            Array.from(rv).forEach((ev) => {
                elemv.addEventListener(ev, function (el) {
                    const rect = el.target.getBoundingClientRect();
                    const x = rect.left;
                    const y = rect.top;
                    const [tip, id, classes, duration, z] = el.target.getAttribute("tool-tip").split(";");
                    textCard(tip, id, classes, x + 15, y + 15, duration, z);
                });
            });
        }
        if (elemv.hasAttribute("modal-tip")) {
            console.log(elemv.getAttribute("modal-tip") + "...");
            const eve = elemv.getAttribute("event");
            let rv = ['mouseover'];
            if (eve) {
                rv = eve.split(";");
            }
            Array.from(rv).forEach((ev) => {
                elemv.addEventListener(ev, function (el) {
                    const rect = el.target.getBoundingClientRect();
                    const x = rect.left;
                    const y = rect.top;
                    const [filename, duration, z] = el.target.getAttribute("modal-tip").split(";");
                    modalCard(filename, x + 15, y + 15, duration, z);
                });
            });
        }
        const ev = elemv.getAttribute("event");
        if (!ev) {
            elemv.addEventListener("click", function () {
                pipes(elemv, auto);
            });
            return;
        }
        const rv = ev.split(";");
        Array.from(rv).forEach((v) => {
            elemv.addEventListener(v, function () {
                pipes(elemv, auto);
            });
        });
    });
}

/**
 * Attaches event listeners to the specified element.
 *
 * @param {HTMLElement} elem - The element to attach event listeners to.
 */
export function attachEventListeners(elem) {
    if (elem.classList.contains('mouse') || elem.id !== null) {
        const events = (elem.getAttribute("event") || "click").split(';');
        events.forEach(event => elem.addEventListener(event, () => {
            pipes(elem);
            console.log(elem.id);
        }));
        if (!hasPipeListener(elem)) {
            elem.addEventListener('click', () => {
                pipes(elem);
                console.log(elem.id);
            });
        }
    }
}

/**
 * Checks if the element has a pipe listener.
 *
 * @param {HTMLElement} elem - The element to check.
 * @returns {boolean} True if the element has a pipe listener, false otherwise.
 */
export function hasPipeListener(elem) {
    return elem && typeof elem.onclick === 'function';
}

/**
 * Adds global listeners to the document.
 *
 * @param {HTMLElement} [elem=document] - The element to add listeners to.
 */
export function addPipe(elem = document) {
    ['click'].forEach(eventType => {
        document.addEventListener(eventType, function (event) {
            let target = event.target;
            if (target.classList.contains('mouse') || target.id !== null) {
                if (!hasPipeListener(target))
                    pipes(target);
                console.log(target.id);
            }
        }, true);
    });
}

/**
 * Highlights the clicked element and initializes pipes.
 *
 * @param {HTMLElement} elem - The element to highlight and initialize pipes.
 */
export function flashClickListener(elem) {
    if (elem.id) {
        elem.removeEventListener('click', () => {
            pipes(elem);
            console.log(elem.id);
        });
        elem.addEventListener('click', () => {
            pipes(elem);
            console.log(elem.id);
        });
    }
    domContentLoad(true);
}

/**
 * Renders a tree view from a JSON object.
 *
 * @param {Object} value - The JSON object to render.
 * @param {string|HTMLElement} tempTag - The ID of the HTML element to insert the tree view into, or the element itself.
 * @returns {HTMLElement} The parent element with the rendered tree view.
 */
export function renderTree(value, tempTag) {
    if (typeof tempTag == "string") {
        tempTag = document.getElementById(tempTag);
    }
    if (value == undefined) {
        console.log(tempTag + "******");
        console.error("value of reference incorrect");
        return;
    }

    var temp = document.createElement(value["tagname"] || 'span');
    temp.id = value["textContent"] || value["label"] || value.keyName;
    temp.classList.add('tree-item');

    if (value.icon) {
        let img = document.createElement('img');
        img.src = value.icon;
        img.style.marginRight = '5px';
        temp.appendChild(img);
    }

    temp.id = value.id;
    temp.textContent = value.textContent || value.label;
    if (temp.textContent.length == 0) {
        console.error("No text content for tree item. Use \"label\" or \"textContent\"");
        exit();
    }

    Object.entries(value).forEach(([k, v]) => {
        let keyName = (!isNaN(k.toString()) ? "data-" + k.toString() : k);
        if (v instanceof Object) {
            let subContainer = document.createElement('span');
            subContainer.classList.add('sub-tree');
            temp.appendChild(subContainer);
            renderTree(v, subContainer);
            temp.addEventListener('click', (e) => {
                e.stopPropagation();
                subContainer.style.display = subContainer.style.display === 'none' ? 'block' : 'none';
            });
        } else if (k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "label" && k.toLowerCase() != "icon") {
            temp.setAttribute(k, v);
        }
    });

    temp.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        temp.classList.add('highlight');
        pipes(temp);
    });

    tempTag.appendChild(temp);

    return tempTag;
}

/**
 * Test function for debugging purposes.
 *
 * @param {any} param1 - The first parameter.
 * @param {any} param2 - The second parameter.
 */
export function test(param1, param2) {
    console.log(param1, param2);
}