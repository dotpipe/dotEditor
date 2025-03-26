import { modala, modalList } from './modal.js';
import { domContentLoad, flashClickListener } from './domUtils.js';

/**
 * Sets AJAX options for the request.
 *
 * @param {HTMLElement} elem - The element containing the AJAX options.
 * @param {Map} opts - The options map to set the AJAX options.
 * @returns {Map} The updated options map.
 */
function setAJAXOpts(elem, opts) {
    var method_thru = (opts["method"] !== undefined) ? opts["method"] : "GET";
    var mode_thru = (opts["mode"] !== undefined) ? opts["mode"] : '{"Access-Control-Allow-Origin":"*"}';
    var cache_thru = (opts["cache"] !== undefined) ? opts["cache"] : "no-cache";
    var cred_thru = (opts["cred"] !== undefined) ? opts["cred"] : '{"Access-Control-Allow-Origin":"*"}';
    var content_thru = (opts["content-type"] !== undefined) ? opts["content-type"] : '{"Content-Type":"text/html"}';
    var redirect_thru = (opts["redirect"] !== undefined) ? opts["redirect"] : "manual";
    var refer_thru = (opts["referrer"] !== undefined) ? opts["referrer"] : "referrer";
    opts.set("method", method_thru);
    opts.set("mode", mode_thru);
    opts.set("cache", cache_thru);
    opts.set("credentials", cred_thru);
    opts.set("content-type", content_thru);
    opts.set("redirect", redirect_thru);
    opts.set("referrer", refer_thru);
    opts.set('body', JSON.stringify(content_thru));

    return opts;
}

/**
 * Forms the AJAX query string from the elements with the specified class name.
 *
 * @param {HTMLElement} elem - The element containing the AJAX options.
 * @param {string} classname - The class name of the elements to include in the query string.
 * @returns {string} The formed AJAX query string.
 */
function formAJAX(elem, classname) {
    var elem_qstring = "";

    for (var i = 0; i < document.getElementsByClassName(classname).length; i++) {
        var elem_value = document.getElementsByClassName(classname)[i];
        elem_qstring = elem_qstring + elem_value.getAttribute('name') + "=" + elem_value.getAttribute('value') + "&";
        if (elem_value.hasOwnProperty("multiple")) {
            for (var o of elem_value.options) {
                if (o.selected) {
                    elem_qstring = elem_qstring + "&" + elem_value.getAttribute('name') + "=" + o.getAttribute('name');
                }
            }
        }
    }
    if (elem.classList.contains("redirect"))
        window.location.href = elem.getAttribute("ajax") + "?" + ((elem_qstring.length > 0) ? elem_qstring : "");
    return (elem_qstring);
}

/**
 * Navigates to the specified URL with the given headers and query parameters.
 *
 * @param {HTMLElement} elem - The element containing the navigation information.
 * @param {Map} opts - The options map to set the AJAX options.
 * @param {string} query - The query parameters to include in the request.
 * @param {string} classname - The class name of the elements to include in the query string.
 */
export function navigate(elem, opts = null, query = "", classname = "") {
    console.log(elem);
    elem_qstring = query + ((document.getElementsByClassName(classname).length > 0) ? formAJAX(elem, classname) : "");
    elem_qstring = encodeURI(elem_qstring);
    console.log(elem_qstring);
    opts = setAJAXOpts(elem, opts);
    var opts_req = new Request(elem_qstring);
    opts.set("mode", (opts["mode"] !== undefined) ? opts["mode"] : '"Access-Control-Allow-Origin":"*"');

    var rawFile = new XMLHttpRequest();
    rawFile.open(opts.get("method"), elem.getAttribute("ajax") + "?" + elem_qstring, true);
    console.log(elem);

    if (elem.classList.contains("strict-json")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";
                try {
                    console.log(rawFile.responseText);
                    JSON.parse(rawFile.responseText);
                }
                catch (e) {
                    console.log("Error: ", e, rawFile.responseText);
                    return;
                }
                document.body.innerHTML = rawFile.responseText;
            }
        }
    }
    else if (elem.classList.contains("json")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";
                try {
                    console.log(rawFile.responseText);
                    var allPretty = JSON.parse(rawFile.responseText);
                    displayColoredJson(elem.getAttribute("insert"), allPretty);
                    if (elem.hasAttribute("insert")) {
                        if (elem.classList.contains("text-html")) {
                        } else {
                            document.getElementById(elem.getAttribute("insert")).textContent = (JSON.stringify(allPretty, null, 2));
                        }
                    }
                    domContentLoad();
                    flashClickListener(elem);
                    return allText;
                }
                catch (e) {
                    console.log("Response not a JSON");
                }
            }
        }
    }
    else if (elem.classList.contains("text-html")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";
                try {
                    allText = (rawFile.responseText);
                    if (elem.hasAttribute("insert")) {
                        document.getElementById(elem.getAttribute("insert")).innerHTML = (rawFile.responseText);
                    }
                    domContentLoad();
                    flashClickListener(elem);
                    return allText;
                }
                catch (e) {
                }
            }
        }
    }
    else if (elem.classList.contains("plain-text")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";
                try {
                    var f = "";
                    allText = (rawFile.responseText);
                    if (elem.hasAttribute("insert")) {
                        document.getElementById(elem.getAttribute("insert")).textContent = (rawFile.responseText);
                    }
                    domContentLoad();
                    flashClickListener(elem);
                    return allText;
                }
                catch (e) {
                }
            }
        }
    }
    else if (elem.classList.contains("tree-view")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";
                try {
                    console.log(rawFile.responseText);
                    allText = JSON.parse(rawFile.responseText);
                    console.log(allText);
                    var editNode = document.getElementById(elem.id);
                    editNode.innerHTML = "";
                    renderTree(allText, editNode);
                    domContentLoad();
                    flashClickListener(elem);
                    return;
                }
                catch (e) {
                    console.log("Response: " + e);
                }
            }
        }
    }
    else if (elem.classList.contains("modala")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = JSON.parse(rawFile.responseText);
                var insertElement = document.getElementById(elem.getAttribute("insert"));
                var boxLimit = elem.getAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : Infinity;

                if (!elem.classList.contains("modala-multi-first") && !elem.classList.contains("modala-multi-last")) {
                    insertElement.innerHTML = "";
                } else if (insertElement.children.length >= boxLimit) {
                    if (elem.classList.contains("modala-multi-first")) {
                        insertElement.lastChild.remove();
                    } else if (elem.classList.contains("modala-multi-last")) {
                        insertElement.firstChild.remove();
                    }
                }
                var newContent = document.createElement('div');
                modala(allText, newContent);
                domContentLoad()
                flashClickListener(elem);
                if (elem.classList.contains("modala-multi-first")) {
                    insertElement.insertBefore(newContent, insertElement.firstChild);
                } else {
                    insertElement.appendChild(newContent);
                }
            }
        }
    }

    else if (!elem.classList.contains("json") && !elem.hasAttribute("callback")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = rawFile.responseText;
                if (document.getElementById(elem.getAttribute("insert")) !== null)
                    document.getElementById(elem.getAttribute("insert")).innerHTML = allText;
            }
        }
    }
    try {
        rawFile.send();
    } catch (e) {
    }
}

/**
 * Prettifies JSON with colors for display.
 *
 * @param {Object} jsonObj - The JSON object to prettify.
 * @returns {string} The prettified JSON string with colors.
 */
function prettifyJsonWithColors(jsonObj) {
    const prettyJson = JSON.stringify(jsonObj, null, 2);
    if (pretty == 0) {
        const style = document.createElement('style');
        style.textContent = `
        .key { color: purple; }
        .string { color: green; }
        .number { color: darkorange; }
        .boolean { color: blue; }
        .null { color: magenta; }
    `;
        document.head.appendChild(style);
    }
    pretty = 1;
    return prettyJson
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
            let cls = 'number';
            if (/^"/.test(match)) {
                cls = match.endsWith('":') ? 'key' : 'string';
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
}

/**
 * Displays colored JSON in the specified element.
 *
 * @param {string} elementId - The ID of the element to display the JSON in.
 * @param {Object} jsonObj - The JSON object to display.
 */
function displayColoredJson(elementId, jsonObj) {
    const prettyHtml = prettifyJsonWithColors(jsonObj);
    document.getElementById(elementId).innerHTML = `<pre>${prettyHtml}</pre>`;
}