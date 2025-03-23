import { shiftFilesLeft, shiftFilesRight, slideCarousel } from './carousel.js';
import { modalList } from './modal.js';
import { fetchContent } from './domUtils.js';

/**
 * Processes the pipes for the given target element.
 *
 * @param {HTMLElement|string} elem - The target element or its ID.
 * @param {boolean} [stop=false] - Whether to stop processing.
 */
export function pipes(elem, stop = false) {
    if (typeof elem === "string") {
        elem = document.getElementById(elem);
    }

    if (!elem || elem.id === null) {
        return;
    }

    let query = "";
    const headers = new Map();
    let formclass = "";

    if (elem.hasAttribute("callback") && typeof window[elem.getAttribute("callback")] === "function") {
        const params = [];
        const calls = sortNodesByName("." + elem.getAttribute("callback-class"));
        Object.keys(calls).forEach((key) => {
            params.push(calls[key].getAttribute("value"));
        });
        window[elem.getAttribute("callback")](params.join(", "));
    }

    if (elem.classList.contains("redirect")) {
        window.location.href = elem.getAttribute("ajax");
    }

    if (elem.classList.contains("disabled")) {
        return;
    }

    if (elem.classList.contains("clear-node")) {
        const pages = elem.getAttribute("node").split(";");
        pages.forEach((e) => {
            document.getElementById(e).innerHTML = "";
        });
    }

    if (elem.tagName === "lnk") {
        window.open(elem.getAttribute("ajax") + (elem.hasAttribute("query") ? "?" + elem.getAttribute("query") : ""), "_blank");
    }

    if (elem.hasAttribute("display") && elem.getAttribute("display")) {
        const optsArray = elem.getAttribute("display").split(";");
        optsArray.forEach((e) => {
            const x = document.getElementById(e);
            if (x !== null) {
                x.style.display = x.style.display !== "none" ? "none" : "block";
            }
        });
    }

    if (elem.hasAttribute("turn")) {
        const optsArray = elem.getAttribute("turn");
        let index = 0;
        if (elem.hasAttribute("turn-index")) {
            index = parseInt(elem.getAttribute("turn-index"));
            const interv = parseInt(elem.getAttribute("interval"));
            index = elem.classList.contains("decrIndex") ? index - interv : index + interv;
            index = index < 0 ? optsArray.length - 1 : index % optsArray.length;
            elem.setAttribute("turn-index", index.toString());
        } else {
            elem.setAttribute("turn-index", "0");
        }

        const classLists = document.querySelectorAll("." + elem.getAttribute("turn"));
        classLists.forEach((e, f) => {
            if (f === index) {
                pipes(e);
            }
        });
    }

    if (elem.hasAttribute("x-toggle")) {
        const optsArray = elem.getAttribute("x-toggle").split(";");
        optsArray.forEach((e) => {
            const [id, className] = e.split(":");
            if (id) {
                document.getElementById(id).classList.toggle(className);
            }
        });
    }

    if (elem.hasAttribute("set") && elem.getAttribute("set")) {
        const js = elem.getAttribute("set");
        js.split(";").forEach((e) => {
            const [id, name, value] = e.split(":");
            if (id) {
                document.getElementById(id).setAttribute(name, value);
            }
        });
    }

    if (elem.hasAttribute("get") && elem.getAttribute("get")) {
        const js = elem.getAttribute("get");
        js.split(";").forEach((e) => {
            const [id, name, target] = e.split(":");
            if (id && name && target) {
                const n = document.getElementById(id).getAttribute(name);
                document.getElementById(target).setAttribute(name, n);
            }
        });
    }

    if (elem.hasAttribute("delete") && elem.getAttribute("delete")) {
        const js = elem.getAttribute("delete");
        js.split(";").forEach((e) => {
            const [id, name] = e.split(":");
            if (id && name) {
                document.getElementById(id).removeAttribute(name);
            }
        });
    }

    if (elem.hasAttribute("remove") && elem.getAttribute("remove")) {
        const optsArray = elem.getAttribute("remove").split(";");
        optsArray.forEach((e) => {
            const x = document.getElementById(e);
            if (x) {
                x.remove();
            }
        });
    }

    if (elem.classList.contains("carousel-step-right") && elem.hasAttribute("insert")) {
        const x = document.getElementById(elem.getAttribute("insert"));
        shiftFilesRight(x, false, parseInt(x.getAttribute("delay")));
    }

    if (elem.classList.contains("carousel-step-left") && elem.hasAttribute("insert")) {
        const x = document.getElementById(elem.getAttribute("insert"));
        shiftFilesLeft(x, false, parseInt(x.getAttribute("delay")));
    }

    if (elem.classList.contains("carousel-slide-left") && elem.hasAttribute("insert")) {
        const x = document.getElementById(elem.getAttribute("insert"));
        slideCarousel(x, 'left', true, parseInt(x.getAttribute("delay")));
    }

    if (elem.classList.contains("carousel-slide-right") && elem.hasAttribute("insert")) {
        const x = document.getElementById(elem.getAttribute("insert"));
        slideCarousel(x, 'right', true, parseInt(x.getAttribute("delay")));
    }

    if (elem.hasAttribute("query")) {
        const optsArray = elem.getAttribute("query").split(";");
        query = optsArray.map(e => e.split(":").join("=")).join("&");
    }

    if (elem.hasAttribute("headers")) {
        const optsArray = elem.getAttribute("headers").split("&");
        optsArray.forEach((e) => {
            const [key, value] = e.split(":");
            headers.set(key, value);
        });
    }

    if (elem.hasAttribute("form-class")) {
        formclass = elem.getAttribute("form-class");
    }

    if (elem.tagName !== "carousel" && elem.hasAttribute("file-order")) {
        fileOrder(elem);
    }

    if (elem.classList.contains("carousel")) {
        const auto = elem.classList.contains("time-active");
        carousel(elem, auto);
        return;
    }

    if (elem.classList.contains("ajax-limit")) {
        const parts = elem.getAttribute("ajax").split(";");
        parts.forEach((part) => {
            const [file, target, limit] = part.split(":");
            const clone = elem.cloneNode(true);
            clone.setAttribute("ajax", file);
            clone.setAttribute("insert", target);
            if (limit) {
                clone.setAttribute("boxes", limit);
            }
            navigate(clone, headers, query, formclass);
        });
        return;
    }

    if (elem.classList.contains("download")) {
        const text = elem.getAttribute("file");
        const element = document.createElement('a');
        const location = elem.getAttribute("directory") || "./";
        element.setAttribute('href', location + encodeURIComponent(text));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return;
    }

    if (elem.hasAttribute("ajax")) {
        navigate(elem, headers, query, formclass);
    } else if (elem.hasAttribute("modal")) {
        modalList(elem.getAttribute("modal"));
    }
}

/**
 * Sorts nodes by their name.
 *
 * @param {string} selector - The selector to match the nodes.
 * @returns {NodeList} The sorted nodes.
 */
function sortNodesByName(selector) {
    const nodes = document.querySelectorAll(selector);
    return Array.from(nodes).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Navigates to the specified URL with the given headers and query parameters.
 *
 * @param {HTMLElement} elem - The element containing the navigation information.
 * @param {Map} headers - The headers to include in the request.
 * @param {string} query - The query parameters to include in the request.
 * @param {string} formclass - The form class to include in the request.
 */
function navigate(elem, headers, query, formclass) {
    const url = elem.getAttribute("ajax") + (query ? "?" + query : "");
    fetch(url, {
        method: 'GET',
        headers: Object.fromEntries(headers),
    })
        .then(response => response.text())
        .then(data => {
            const target = document.getElementById(elem.getAttribute("insert"));
            if (target) {
                target.innerHTML = data;
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Orders files based on the specified criteria.
 *
 * @param {HTMLElement} elem - The element containing the file order information.
 */
function fileOrder(elem) {
    if (typeof elem === "string") {
        elem = document.getElementById(elem);
    }

    const arr = elem.getAttribute("sources").split(";");
    const ppfc = document.getElementById(elem.getAttribute("insert").toString());
    if (!ppfc.hasAttribute("file-index")) {
        ppfc.setAttribute("file-index", "0");
    }
    let index = parseInt(ppfc.getAttribute("file-index").toString());
    const interv = elem.getAttribute("interval");
    if (elem.classList.contains("decrIndex")) {
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) - interv;
    } else {
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) + interv;
    }
    if (index < 0) {
        index = arr.length - 1;
    }
    index = index % arr.length;
    ppfc.setAttribute("file-index", index.toString());

    if (ppfc.tagName === "SOURCE" && ppfc.hasAttribute("src")) {
        try {
            ppfc.parentNode.pause();
            ppfc.parentNode.setAttribute("src", arr[index].toString());
            ppfc.parentNode.load();
            ppfc.parentNode.play();
        } catch (e) {
            ppfc.setAttribute("src", arr[index].toString());
        }
    } else if (ppfc && ppfc.tagName === "IMG") {
        ppfc.setAttribute("src", arr[index].toString());
        let loop = index;
        while (loop % arr.length !== (index + iter) % arr.length) {
            if (elem.getAttribute("direction").toLowerCase() !== "left") {
                ppfc.removeChild(ppfc.lastChild);
            } else {
                ppfc.removeChild(ppfc.firstChild);
            }
            const obj = document.createElement("img");
            obj.setAttribute("src", arr[loop % arr.length].toString());

            if (elem.getAttribute("direction").toLowerCase() !== "left") {
                ppfc.insertBefore(obj, ppfc.firstChild);
            } else {
                ppfc.appendChild(obj);
            }
            loop++;
        }
    }
}

/**
 * Handles carousel functionality.
 *
 * @param {HTMLElement} elem - The carousel element.
 * @param {boolean} auto - Whether to automatically slide the carousel.
 */
function carousel(elem, auto) {
    const delay = parseInt(elem.getAttribute("delay"));
    if (auto) {
        setTimeout(() => {
            shiftFilesRight(elem, auto, delay);
            carousel(elem, auto);
        }, delay);
    }
}