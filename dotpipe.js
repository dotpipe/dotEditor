/**
  *  All tags being used must have an 'id' attribute
  *  Usable DOM Attributes (almost all are enabled for combinations)
  *  Attribute/Tag   |   Use Case
  *  -------------------------------------------------------------
  *  insert............= [Attr] return ajax call to this id
  *  ajax..............= [Attr] * calls and returns the value file's output ex: <pipe id="id1" ajax="foo.bar:insert1:countByEvent" query="key0:value0;" insert="someID">
  *  ajax-limit........= [Attr] * limit the insertions to a element ex: <pipe id="id1" class="ajax-limit" ajax="foo.bar:insert1" boxes="countByEvent" query="key0:value0;">
  *  query.............= [Attr] default query string associated with url ex: <anyTag form-class="someClass" query="key0:value0;key1:value2;" ajax="page.foo"> (Req. form-class)
  *  turn..............= [Attr] * turns based element routine element ex: <anyTag turn="firstelem;secondelem;" class="decrIndex" index="1"> 
  *  callback..........= [Attr] callback function ex: <pipe id="id1" callback="foo" class="class1 class2" value="submit" callback-class="class1 class2" ajax="page.foo;insert-id1">
  *  callback-class....= [Attr] class to be used in the callback function ex: <pipe id="id1" callback="foo" class="class1 class2" value="submit" callback-class="class1 class2" ajax="page.foo;insert-id1">
  *     - note: names will be sorted alphabetically in the param list. Params can be infinite. just ready your function for that consolidatoin of params.
  *  modal.............= [Modala Key] * Inserts JSON files in the insert targets for template ease of use. "modal": "json1.json:insert1.insert2.insert3;continued"
  *  download..........= [Class] for downloading files ex: <tagName class="download" file="foo.zip" directory="/home/bar/"> (needs ending with slash)
  *  file..............= [Attr] filename to download
  *  set...............= [Attr] set the value of the element attribute ex: <tagName set="set-this-id:attribute-name:value">
  *  get...............= [Attr] get the value of the element attribute and return to this element ex: <tagName get="get-this-id:attribute-name">
  *  delete............= [Attr] delete the value of the element attribute ex: <tagName delete="delete-this-id:attribute-name">
  *  x-toggle..........= [Attr] toggle values from class attribute that are listed in the toggle attribute "id1:class1;id1:class2;id2:class2"
  *  directory.........= [Attr] relative or full path of 'file'
  *  tool-tip..........= [Attr] tooltip for the element ex: <tagName tool-tip="this is a tooltip;id;class;duration;zIndex">
  *  modal-tip..........= [Attr] tooltip for the element ex: <tagName tool-tip="filename.json;duration;zIndex">
  *  copy..............= [Attr] copy the value of the element to the clipboard ex: <tagName copy="copy-this-id">
  *  clear-node........= [Class] clear nodes. delimited in insert="first;second;thirdnode" by ';'
  *  redirect..........= [Class] "follow" the ajax call in POST or GET mode ex: <pipe ajax="foo.bar" class="redirect" query="key0:value0;" insert="someID">
  *  modala-multi-last.= [Class] to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the last
  *  modala-multi-first= [Class] to create multi-ajax calls ex: ajax="foo.bar:insertHere:x;.." the 'x' is the max number of insertions while removing the first
  *  time-active.......= [Class] to activate timers for things that go on continuously
  *  time-inactive.....= [Class] to deactivate timers for things that go on continuously
  *  disabled..........= [Class] to disable a tag (use x-toggle to toggle state of this and time-active/-inactive)
  *  br................= [Specifically a] Modala key/value pair. "br": "x" where x is the number of breaks in succession.
  *  js................= [Specifically a] Modala key/value pair. Allows access to outside JavaScript files in scope of top nest.
  *  css...............= [Specifically a] Modala key/value pair. Imports a stylesheet file to the page accessing it.
  *  modala............= [Specifically a] Modala key/value pair. Allows access to Modala files in scope of top nest.
  *  tree-view.........= [Specifically a] Modala key/value pair or class. Allows access to Tree files in scope of top nest.
  *  strict-json.......= [Class] returns only JSON to full page as response. Error on non-parse
  *  <lnk>.............= [Tag] tag for clickable link <lnk ajax="goinghere.html" query="key0:value0;">
  *  <pipe>............= [Tag] (initializes on DOMContentLoaded Event) ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  <dyn>.............= [Tag] Automatic eventListening tag for onclick="pipes(this)" ex: <dyn ajax="foo.bar" query="key0:value0;" insert="someID">
  *  \n................= [-] RegEx emplacement to insert <br /> in Modala contents for innerHTML
  *  plain-text........= [Class] plain text returned to the insertion point
  *  plain-html........= [Class] returns as true HTML
  *  redirect..........= [Class] redirects to the ajax call in POST or GET mode ex: <tag id="someref" ajax="foo.bar" class="redirect" query="key0:value0;">
  *  <timed>...........= [Tag] Timed result refreshing tags (Keep up-to-date handling on page) ex: <timed ajax="foo.bar" delay="3000" query="key0:value0;" insert="someID">
  *  delay.............= [Attr] delay between <timed> tag refreshes (required for <timed> tag) ex: see <timed>
  *  <carousel>........= [Tag] to create a carousel that moves every a timeOut() delay="x" occurs ex: <carousel ajax="foo.bar" file-order="foo.bar;bar.foo;foobar.barfoo" delay="3000" id="thisId" insert="thisId" height="100" width="100" boxes="8" style="height:100;width:800">
  *  carousel-step-right.= [Class] to move the carousel to the right
  *  carousel-step-left.= [Class] to move the carousel to the left
  *  carousel-slide-right.= [Class] to iterate the carousel to the right
  *  carousel-slide-left.= [Class] to iterate the carousel to the left
  *  boxes.............= [Attr] attribute to request for x boxes for carousel elementss ex: <carousel ajax="foo.bar" file-order="foo.bar;bar.foo;foobar.barfoo" delay="3000" id="thisId" insert="thisId" height="100" width="100" boxes="8" style="height:100;width:800">
  *  file-order........= [Attr] ajax to these files, iterating [0,1,2,3]%array.length per call (delimited by ';') ex: <pipe query="key0:value0;" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  file-index........= [Attr] counter of which index to use with file-order to go with ajax ex: <pipe ajax="foo.bar" query="key0:value0;" insert="someID">
  *  incrIndex.........= [Class] increment thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="incrIndex" interval="2" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  decrIndex.........= [Class] decrement thru index of file-order (0 moves once) (default: 1) ex: <pipe ajax="foo.bar" class="decrIndex" interval="3" file-order="foo.bar;bar.foo;foobar.barfoo" insert="someID">
  *  interval..........= [Attr] Take this many steps when stepping through file-order default = 1
  *  mode..............= [Attr] "POST" or "GET" (default: "POST") ex: <pipe mode="POST" set-attr="value" ajax="foo.bar" query="key0:value0;" insert="thisOrSomeID">
  *  multiple..........= [Class] states that this object has two or more key/value pairs use: states this is a multi-select form box
  *  remove............= [Attr] * remove element in tag ex: <anyTag remove="someID;someOtherId;">
  *  display...........= [Attr] toggle visible and invisible of anything in the value ex: <anyTag display="someID;someOtherId;">
  *  json..............= [Class] returns a JSON file set as value
  *  headers...........= [Attr] headers in CSS markup-style (delimited by '&') <any ajax="foo.bar" headers="foobar:boo&barfoo:barfoo;q:9&" insert="someID">
  *  form-class........= [Attr] class of devoted form elements
  *  action-class......= [Class] name of devoted to-be-triggered tags (acts as listener to other certain tag(s))
  *  mouse.............= [Class] name to work thru PipesJS' other attributes on event="mouseover;mouseleave" (example)
  *  mouse-insert......= [Class] name to work thru PipesJS' other attributes on event="mouseover;mouseleave" (example)
  *  event.............= [Attr] works with mouse/pipe class only.event="click;dblclick;etc" activates according to the event, like a normal click would
  *  options...........= [Attr] works with <select> tagName only. Key:Value; pairs to setup and easily roll out multiple selects.
  **** FILTERS aer go ahead code usually coded in other languages and just come back with a result. Not wholly different from AJAX. They are general purpose files.
  **** ALL HEADERS FOR AJAX are available. They will use defaults to
  **** go on if there is no input to replace them.
  */

  let PAGE_NONCE = '';

  document.addEventListener("DOMContentLoaded", function () {
    try {
        if (document.body != null && JSON.parse(document.body.textContent)) {
            const irc = JSON.parse(document.body.textContent);

            document.body.textContent = "";
            modala(irc, document.body);
            document.body.style.display = "block";
        }
    }
    catch (e) {
    }

    domContentLoad();
    addPipe(document.body);

    generateNonce().then(nonce => {
        const script_tags = document.getElementsByTagName("script");
        const style_tags = document.getElementsByTagName("style");

        Array.from(script_tags).forEach(function (elem) {
            elem.nonce = nonce;
        });
        Array.from(style_tags).forEach(function (elem) {
            elem.nonce = nonce;
        });
        PAGE_NONCE = nonce
        var meta = document.createElement("meta");
        meta.content = `script-src 'self' 'nonce-${PAGE_NONCE}'; 
                style-src 'self' 'nonce-${PAGE_NONCE}'; 
                style-src-attr 'nonce-${PAGE_NONCE}';
                img-src 'self'; 
                child-src 'none'; 
                object-src 'none'`;
        meta.httpEquiv = "Content-Security-Policy";
        document.head.appendChild(meta);
        addNoncesToStyledElements(PAGE_NONCE);
    });
});

let domContentLoad = (again = false) => {
    doc_set = document.getElementsByTagName("pipe");
    if (again == false) {
        Array.from(doc_set).forEach(function (elem) {
            if (elem.classList.contains("pipe-active"))
                return;
            elem.classList.toggle("pipe-active")
            pipes(elem);
        });
    }

    let elementsArray_time = document.getElementsByTagName("timed");
    Array.from(elementsArray_time).forEach(function (elem) {
        if (elem.classList.contains("time-inactive"))
            return;
        if (elem.classList.contains("time-active")) {
            auto = true;
            setTimers(elem);
        }
        else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
    });

    let elementsArray_dyn = document.getElementsByTagName("dyn");
    Array.from(elementsArray_dyn).forEach(function (elem) {
        if (elem.classList.contains("disabled"))
            return;
        elem.classList.toggle("disabled");
    });

    let elements_Carousel = document.getElementsByTagName("carousel");
    Array.from(elements_Carousel).forEach(function (elem) {
        if (elem.classList.contains("time-inactive"))
            return;
        if (elem.classList.contains("time-active")) {
            auto = true;
            setTimers(elem);
        }
        else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
        setTimeout(carousel(elem, auto), elem.getAttribute("delay"));
    });

    let elementsArray_link = document.getElementsByTagName("lnk");
    Array.from(elementsArray_link).forEach(function (elem) {
        if (elem.classList.contains("disabled"))
            return;
        elem.classList.toggle("disabled");

    });

    let elements_mouse = document.querySelectorAll(".mouse");
    console.log(elements_mouse.length);
    Array.from(elements_mouse).forEach(function (elemv) {
        console.log(elemv);
        if (elemv.hasAttribute("tool-tip")) {
            console.log(elemv.getAttribute("modal-tip") + "...");
            var eve = elemv.getAttribute("event");
            rv = ['mouseover'];
            if (eve) {
                rv = ev.split(";");
            }
            Array.from(rv).forEach((ev) => {
                elemv.addEventListener(ev, function (el) {
                    const rect = el.target.getBoundingClientRect();
                    const x = rect.left;
                    const y = rect.top;
                    var duration = 750;
                    var [tip, id, classes, duration, z] = el.target.getAttribute("tool-tip").split(";");
                    textCard(tip, id, classes, x + 15, y + 15, duration, z);
                });
            });
        }
        if (elemv.hasAttribute("modal-tip")) {
            console.log(elemv.getAttribute("modal-tip") + "...");
            var eve = elemv.getAttribute("event");
            rv = ['mouseover'];
            if (eve) {
                rv = ev.split(";");
            }
            Array.from(rv).forEach((ev) => {
                elemv.addEventListener(ev, function (el) {
                    const rect = el.target.getBoundingClientRect();
                    const x = rect.left;
                    const y = rect.top;
                    var [filename, duration, z] = el.target.getAttribute("modal-tip").split(";");
                    modalCard(filename, x + 15, y + 15, duration, z);
                });
            });
        }
        var ev = elemv.getAttribute("event");
        if (!ev) {
            elemv.addEventListener("click", function () {
                pipes(elemv, auto);
            });
            return;
        }
        var rv = ev.split(";");
        Array.from(rv).forEach((v) => {
            elemv.addEventListener(v, function () {
                pipes(elemv, auto);
            });
        });
    });
}

function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return crypto.subtle.digest('SHA-256', data).then(hash => {
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    });
}

// Usage example to generate a nonce
function generateNonce() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    return sha256(randomBytes.join('')).then(hash => hash.slice(0, 16));
}

/**
 * Adds nonces to all elements with style attributes
 * @param {string} nonce - The page nonce value
 * @param {HTMLElement} [root=document.body] - Root element to start searching from
 */
function addNoncesToStyledElements(nonce, root = document.body) {
    // Get all elements with style attribute
    const elements = root.querySelectorAll('[style]');
    
    elements.forEach(element => {
        // Skip if element already has a nonce
        if (!element.hasAttribute('nonce')) {
            element.setAttribute('nonce', nonce);
        }
    });

    // Watch for new elements being added
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check the added element
                    if (node.hasAttribute('style') && !node.hasAttribute('nonce')) {
                        node.setAttribute('nonce', nonce);
                    }
                    // Check children of added element
                    const childrenWithStyle = node.querySelectorAll('[style]');
                    childrenWithStyle.forEach(child => {
                        if (!child.hasAttribute('nonce')) {
                            child.setAttribute('nonce', nonce);
                        }
                    });
                }
            });
        });
    });

    // Configure the observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return observer; // Return observer in case you need to disconnect it later
}

function copyContentById(id) {
    // Get the element with the specified ID
    var element = document.getElementById(id);

    // Check if element exists
    if (element) {
        // Create a new textarea element to copy the content
        var textarea = document.createElement('textarea');

        // Set the value of the textarea to the content of the element
        textarea.value = element.innerText;

        // Append the textarea to the body
        document.body.appendChild(textarea);

        // Select the text in the textarea
        textarea.select();

        // Copy the selected text to the clipboard
        document.execCommand('copy');

        // Remove the textarea from the body
        document.body.removeChild(textarea);
        textCard("Copied to the clipboard!", "id-copy", "", true, 25, 3000, 100);
        domContentLoad();
        return true;
        // Alert the user that the content has been copied
    } else {
        // Alert the user that the element does not exist
        alert('Element with ID ' + id + ' not found.');
        return false;
    };
}

function modalCard(filename, x_center = false, y_center = false, duration = -1, zindex = 100) {
    var copied = document.createElement("div");
    copied.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    copied.style.padding = "10px";
    copied.style.textAlign = "center";
    copied.style.backgroundColor = "white";
    copied.style.position = "absolute";
    copied.setAttribute('nonce', PAGE_NONCE); // Add nonce for inline styles
    var x_pos = 0;
    if (typeof x_center === 'boolean' && x_center) x_pos = (document.body.offsetWidth - copied.style.width) / 2;
    else if (typeof x_center === 'boolean' && !x_center) x_pos = 0;
    else x_pos = x_center;
    copied.style.left = x_pos + "px";
    var y_pos = 0;
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

function textCard(text, id = "", classes = "", x_center = false, y_center = false, duration = -1, zindex = 100) {
    var copied = document.createElement("div");
    copied.id = id;
    if (classes != undefined && classes != "")
        copied.classList.add(classes);
    copied.style.padding = "10px";
    copied.style.textAlign = "center";
    copied.style.backgroundColor = "white";
    copied.style.position = "absolute";
    copied.setAttribute('nonce', PAGE_NONCE); // Add nonce for inline styles
    var x_pos = 0;
    if (typeof x_center === 'boolean' && x_center) x_pos = (document.body.offsetWidth - copied.style.width) / 2;
    else if (typeof x_center === 'boolean' && !x_center) x_pos = 0;
    else x_pos = x_center;
    copied.style.left = x_pos + "px";
    copied.style.zIndex = zindex;
    copied.textContent = text;
    var y_pos = 0;
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

let highlightedItem = null;

function renderTree(value, tempTag) {
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

    // temp = htmlDecode(temp);

    tempTag.appendChild(temp);

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
function modalaHead(value) {

    try {
        if (value == undefined) {
            console.error("value of reference incorrect");
            return;
        }
    }
    catch (e) {
        console.log(e)
    }
    var temp = document.createElement(value["tagname"]);
    Object.entries(value).forEach((nest) => {
        const [k, v] = nest;
        if (v instanceof Object) {
            modalaHead(v);
        }
        else if (k.toLowerCase() == "title") {
            var title = document.createElement("title");
            title.innerText = v;
            document.head.appendChild(title);
        }
        else if (k.toLowerCase() == "css") {
            var optsArray = v.split(";");
            console.log(v)
            optsArray.forEach((e, f) => {
                var cssvar = document.createElement("link");
                cssvar.href = v;
                cssvar.rel = "stylesheet";
                document.head.appendChild(cssvar);
            });

        }
        else if (k.toLowerCase() == "js") {
            var optsArray = v.split(";");
            console.log(v)
            optsArray.forEach((e, f) => {
                const js = document.createElement("script");
                js.src = e;
                document.head.appendChild(js);
            });
        }
        else if (k.toLowerCase() == "modal") {
            fetch(v)
                .then(response => response.json())
                .then(data => {
                    const tmp = modalaHead(data, temp, root, id);
                    document.head.appendChild(tmp);
                });
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
            temp.setAttribute(k, v);
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && (k.toLowerCase() == "textcontent" || k.toLowerCase() == "innerhtml" || k.toLowerCase() == "innertext")) {
            (k.toLowerCase() == "textcontent") ? temp.textContent = v : (k.toLowerCase() == "innerhtml") ? temp.innerHTML = v : temp.innerText = v;
        }
    });

    return;
}

/**
 * Displays a modal dialog with content from a JSON file.
 *
 * @param {string} filename - The URL or path to the JSON file containing the modal content.
 * @param {string|HTMLElement} tagId - The ID of the HTML element to insert the modal into, or the element itself.
 */
function modal(filename, tagId) {
    if (typeof (tagId) == "string") {
        tagId = document.getElementById(tagId);
    }
    const draft = getJSONFile(filename)
    return draft.then(function (res) {
        modala(res, tagId);
    });
}

/**
 * Displays a list of modals from a JSON file.
 *
 * @param {string} filenames - A string containing one or more filenames separated by semicolons. Each filename can optionally have a colon-separated target element ID.
 * @example
 * modalList('modal.json:modal-container.another-container;another-modal.json:another-target');
 */
function modalList(filenames) {
    const files = filenames.split(";");
    if (files.length >= 1) {
        files.forEach(file => {
            const f = file.split(":");
            if (f[1] != undefined && f[1].split(".").length > 1) {
                f[1].split(".").forEach(insert => {
                    modal(f[0], insert);
                });
            }
            else {
                console.log(f);
                modal(f[0], f[1]);
            }
        });
    }
    else {
        console.log(files)
        modal(files[0].split(":")[0], files[0].split(":")[1]);
    }
}


/**
 * Fetches a JSON file from the specified URL or path and returns the parsed JSON data.
 *
 * @param {string} filename - The URL or path to the JSON file to fetch.
 * @returns {Promise<any>} - A Promise that resolves to the parsed JSON data.
 */
function getJSONFile(filename) {
    const resp = fetch(filename)
        .then(response => response.json())
        .then(data => {
            return data;
        });
    return resp.then(function (res) {
        return res;
    });
    return f;
}

/**
 * Fetches a text file from the specified URL or path and returns the text content.
 *
 * @param {string} filename - The URL or path to the text file to fetch.
 * @returns {Promise<string>} - A Promise that resolves to the text content of the file.
 */
function getTextFile(filename) {
    const resp = fetch(filename)
        .then(response => response.text())
        .then(data => {
            return data;
        });
    return resp.then(function (res) {
        return res;
    });
}

function escapeHtml(html) {
    var text = document.createTextNode(html);
    var p = document.createElement('p');
    p.innerHTML = (text.innerHTML);
    console.log(p);
    return p.innerHTML;
}

/**
 * 
 * @param {JSON Object} value 
 * @param {string} tempTag 
 * @param {} root 
 * @param {*} id 
 * @returns HTML Object
 */
function modala(value, tempTag, root, id) {
    if (typeof (tempTag) == "string") {
        tempTag = document.getElementById(tempTag);
    }
    if (root === undefined)
        root = tempTag;
    if (tempTag == undefined) {
        return;
    }
    if (value == undefined) {
        console.log(tempTag + "******");
        console.error("value of reference incorrect");
        return;
    }

    var temp = document.createElement(value["tagname"]);
    if (value["tagname"] == "undefined") {
        temp.tagName = "div";
        temp = document.createElement("div");
    }
    if (value["header"] !== undefined && value["header"] instanceof Object) {

        modalaHead(value["header"], "head", root, null);
        var meta = document.createElement("meta");
        meta.content = "script-src-elem 'self'; img-src 'self'; style-src 'self'; child-src 'none'; object-src 'none'";
        meta.httpEquiv = "Content-Security-Policy";
        document.head.appendChild(meta);
    }
    Object.entries(value).forEach((nest) => {
        const [k, v] = nest;
        if (k.toLowerCase() == "header");
        else if (k.toLocaleLowerCase() == "buttons" && v instanceof Object) {
            var buttons = document.createElement("div");
            v.forEach(z => {
                var button = document.createElement("input");
                console.log(z);
                button.type = "button";
                var keys = ["text", "value", "textcontent", "innerhtml", "innerText"];
                Object.entries(z).forEach(x => {
                    const [key, val] = x;
                    console.log(["text", "value", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase()));
                    vals = escapeHtml(val);
                    if (["text", "value", "textcontent", "innerhtml", "innertext"].includes(key.toLowerCase()))
                        button.value = val;
                    else
                        button.setAttribute(key, val);
                });
                temp.appendChild(button);
            });
            // modala(v, tempTag, root, id);
        }
        else if (v instanceof Object)
            modala(v, tempTag, root, id);
        else if (v instanceof Object)
            modala(v, tempTag, root, id);
        else if (k.toLowerCase() == "br") {
            let brs = v;
            while (brs) {
                temp.appendChild(document.createElement("br"));
                brs--;
            }
        }
        else if (k.toLowerCase() == "select") {
            var select = document.createElement("select");
            temp.appendChild(select);
            modala(v, temp, root, id);
        }
        else if (k.toLowerCase() == "options" && temp.tagName.toLowerCase() == "select") {
            var optsArray = v.split(";");
            var options = null;
            console.log(v)
            optsArray.forEach((e, f) => {
                var g = e.split(":");
                options = document.createElement("option");
                options.setAttribute("value", g[1]);
                options.textContent = (g[0]);
                temp.appendChild(options);
            });
            temp.appendChild(options);
            console.log("*")
        }
        else if (k.toLowerCase() == "sources" && (temp.tagName.toLowerCase() == "card" || temp.tagName.toLowerCase() == "carousel")) {
            console.log(value);
            var optsArray = v.split(";");
            var options = null;
            var i = (value['index'] == undefined) ? 0 : value['index'];
            temp.id = value['id'];
            optsArray.forEach((e, f) => {
                if (value['boxes'] == temp.childElementCount)
                    return;
                if (value['type'] == "img") {
                    var gth = document.createElement("img");
                    gth.src = e;
                    gth.width = value['width'];
                    gth.height = value['height'];
                    gth.style.display = "hidden";
                    temp.setAttribute("sources", value['sources'])
                    temp.appendChild(gth);
                }
                else if (value['type'] == "audio") {
                    var gth = document.createElement("source");
                    gth.src = e;
                    gth.width = value['width'];
                    gth.height = value['height'];
                    while (e.substr(-i, 1) != '.') i++;
                    gth.type = "audio/" + e.substring(-(i - 1));
                    gth.controls = (values['controls'] != undefined && value['controls'] != false) ? true : false;
                    temp.appendChild(gth);
                }
                else if (value['type'] == "video") {
                    var gth = document.createElement("source");
                    gth.src = e;
                    gth.width = value['width'];
                    gth.height = value['height'];
                    gth.style.display = "hidden";
                    var i = 0;
                    while (e.substr(-i, 1) != '.') i++;
                    gth.type = "video/" + e.substring(-(i - 1));
                    gth.controls = (values['controls'] != undefined && value['controls'] != false) ? true : false;
                    temp.appendChild(gth);
                }
                else if (value['type'] == "modal") {
                    modalList(v)
                }
                else if (value['type'] == "html") {
                    console.log(e);
                    fetch(e)
                        .then(response => response.text())
                        .then(data => {
                            var div = document.createElement("div");
                            div.innerHTML = data;
                            tempTag.appendChild(div);
                        });
                }
                else if (value['type'] == "php") {
                    console.log(e);
                    fetch(e)
                        .then(response => response.text())
                        .then(data => {
                            var div = document.createElement("div");
                            div.innerHTML = data;
                            tempTag.appendChild(div);
                        });
                }
            });

        }
        else if (k.toLowerCase() == "css") {
            var cssvar = document.createElement("link");
            cssvar.href = v;
            cssvar.rel = "stylesheet";
            tempTag.appendChild(cssvar);
        }
        else if (k.toLowerCase() == "js") {
            var js = document.createElement("script");
            js.src = v;
            js.setAttribute("defer", "true");
            tempTag.appendChild(js);
        }
        else if (k.toLowerCase()[0] == "h" && k.length == 2) {
            var h = document.createElement(k);
            h.innerText = v;
            tempTag.appendChild(h);
        }
        else if (k.toLowerCase() == "modal") {
            modalList(v)
        }
        else if (k.toLowerCase() == "html") {
            fetch(v)
                .then(response => response.text())
                .then(data => {
                    var div = document.createElement("div");
                    div.innerHTML = data;
                    tempTag.appendChild(div);
                });
        }
        else if (k.toLowerCase() == "php") {
            fetch(v)
                .then(response => response.text())
                .then(data => {
                    var div = document.createElement("div");
                    div.innerHTML = data;
                    tempTag.appendChild(div);
                });
        }
        else if (k.toLowerCase() == "boxes") {
            console.log(v);
            temp.setAttribute("boxes", v);
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && k.toLowerCase() != "textcontent" && k.toLowerCase() != "innerhtml" && k.toLowerCase() != "innertext") {
            try {
                temp.setAttribute(k, v);
            }
            catch (e) {
                console.error(`Error setting attribute ${k}:`, e);
            }
        }
        else if (!Number(k) && k.toLowerCase() != "tagname" && (k.toLowerCase() == "textcontent" || k.toLowerCase() == "innerhtml" || k.toLowerCase() == "innertext")) {
            const val = v.replace(/\r?\n/g, "<br>");
            (k.toLowerCase() == "textcontent") ? temp.textContent = val : (k.toLowerCase() == "innerhtml") ? temp.innerHTML = val : temp.innerText = val;
        }
        else if (k.toLowerCase() == "style") {
            temp.style.cssText = v;
        }
    });
    tempTag.appendChild(temp);
    domContentLoad();

    // Save the grid data to the database
    saveGridData(value);

    return tempTag;
}

/**
 * @param {string} target
 * @example
 * 
 */
function setTimers(target) {
    var delay = target.getAttribute("delay");
    if (target.classList.contains("time-inactive") && target.classList.contains("time-active")) {
        target.classList.toggle("time-active")
        return;
    }
    else if (target.classList.contains("time-active")) {
    }
    else if (target.classList.contains("time-inactive")) {
    }
    else {
        target.classList.toggle("time-inactive")
    }

    setTimeout(function () {
        pipes(target);
        setTimers(target);
    }, delay);
}

function carouselButtonSlide(elem, direction) {

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    if (direction.toLowerCase() == "right")
        shiftFilesRight(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
    else
        shiftFilesLeft(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
}

function carouselButtonStep(elem, direction) {

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    if (direction.toLowerCase() == "right")
        shiftFilesRight(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
    else
        shiftFilesLeft(elem.getAttribute("insert"), auto, elem.getAttribute("delay"));
}

function shiftFilesLeft(elem, auto = false, delay = 1000) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);

    console.error(elem)
    var iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
    var i = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
    var b = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;

    var h = 0;

    while (h < b) {
        elem.removeChild(elem.firstChild);
        var cloneSrcs = elem.getAttribute("sources").split(";");
        var clones = cloneSrcs[(h + i) % cloneSrcs.length];
        var newClone = null;
        if (elem.getAttribute("type").toLowerCase() == ('audio' | 'video'))
            newClone = document.createElement(elem.getAttribute("source"));
        else if (elem.getAttribute("type").toLowerCase() == ('modal'))
            modalList(clones);
        else if (elem.getAttribute("type").toLowerCase() == ('php' | 'html')) {
            var f = htmlToJson(getTextFile(clones));
            modalList(f)
        }
        else
            newClone = document.createElement(elem.getAttribute("type"));
        newClone.src = clones;
        newClone.height = elem.getAttribute("height");
        newClone.width = elem.getAttribute("width");
        elem.appendChild(newClone);
        h++;
    }

    if (elem.hasAttribute("vertical") && elem.getAttribute("vertical") == "true")
        elem.style.display = "block";
    else
        elem.style.display = "inline-block";

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    elem.setAttribute("index", (i + iter) % elem.children.length);
    if (auto == "on")
        setTimeout(() => { shiftFilesLeft(elem, auto, delay); }, (delay));

}
function shiftFilesRight(elem, auto = false, delay = 1000) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);

    console.error(elem)
    var iter = elem.hasAttribute("iter") ? parseInt(elem.getAttribute("iter")) : 1;
    var i = elem.hasAttribute("index") ? parseInt(elem.getAttribute("index")) : 0;
    var b = elem.hasAttribute("boxes") ? parseInt(elem.getAttribute("boxes")) : 1;

    var h = 0;

    while (h < b) {
        elem.removeChild(elem.lastChild);
        var cloneSrcs = elem.getAttribute("sources").split(";");
        var clones = cloneSrcs[(h + i) % cloneSrcs.length];
        var newClone = null;
        if (elem.getAttribute("type").toLowerCase() == ('audio' | 'video'))
            newClone = document.createElement(elem.getAttribute("source"));
        else if (elem.getAttribute("type").toLowerCase() == ('modal'))
            modalList(clones);
        else if (elem.getAttribute("type").toLowerCase() == ('php' | 'html')) {
            var f = htmlToJson(getTextFile(clones));
            modalList(f)
        }
        else
            newClone = document.createElement(elem.getAttribute("type"));
        newClone.src = clones;
        newClone.height = elem.getAttribute("height");
        newClone.width = elem.getAttribute("width");
        elem.prepend(newClone);
        h++;
    }

    if (elem.hasAttribute("vertical") && elem.getAttribute("vertical") == "true")
        elem.style.display = "block";
    else
        elem.style.display = "inline-block";

    if (elem.classList.contains("time-active")) {
        auto = true;
    }
    else if (elem.classList.contains("time-inactive")) {
        auto = false;
    }
    elem.setAttribute("index", (i + iter) % elem.children.length);
    if (auto == "on")
        setTimeout(() => { shiftFilesLeft(elem, auto, delay); }, (delay));

}

function fileShift(elem) {
    var i = elem.getAttribute("index");
    var iter = elem.getAttribute("iter");
    var b = elem.getAttribute("boxes");
    var h = 0;
    var g = 0;
    var arr = elem.getAttribute("sources").split(";");
    var ppfc = document.getElementById(elem.getAttribute("insert").toString());
    if (!ppfc.hasAttribute("file-index"))
        ppfc.setAttribute("file-index", "0");
    index = parseInt(ppfc.getAttribute("file-index").toString());
    var interv = elem.getAttribute("interval");
    if (elem.classList.contains("decrIndex"))
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) - interv;
    else
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) + interv;
    if (index < 0)
        index = arr.length - 1;
    index = index % arr.length;
    ppfc.setAttribute("file-index", index.toString());

}

function fileOrder(elem) {
    if (typeof (elem) == "string")
        elem = document.getElementById(elem);

    arr = elem.getAttribute("sources").split(";");
    ppfc = document.getElementById(elem.getAttribute("insert").toString());
    if (!ppfc.hasAttribute("file-index"))
        ppfc.setAttribute("file-index", "0");
    index = parseInt(ppfc.getAttribute("file-index").toString());
    var interv = elem.getAttribute("interval");
    if (elem.classList.contains("decrIndex"))
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) - interv;
    else
        index = Math.abs(parseInt(ppfc.getAttribute("file-index").toString())) + interv;
    if (index < 0)
        index = arr.length - 1;
    index = index % arr.length;
    ppfc.setAttribute("file-index", index.toString());

    if (ppfc.tagName == "SOURCE" && ppfc.hasAttribute("src")) {
        try {
            ppfc.parentNode.pause();
            ppfc.parentNode.setAttribute("src", arr[index].toString());
            ppfc.parentNode.load();
            ppfc.parentNode.play();
        }
        catch (e) {
            ppfc.setAttribute("src", arr[index].toString());
        }
    }
    else if (ppfc && ppfc.tagName == "IMG") {
        ppfc.setAttribute("src", arr[index].toString());
        var loop = index;
        while (loop % arr.length != (index + iter) % arr.length) {
            if (elem.getAttribute("direction").toLowerCase() !== "left")
                ppfc.removeChild(ppfc.lastChild);
            else
                ppfc.removeChild(ppfc.firstChild);
            var obj = document.createElement("img");
            obj.setAttribute("src", arr[loop % arr.length].toString());

            if (elem.getAttribute("direction").toLowerCase() !== "left")
                ppfc.insertBefore(obj, ppfc.firstChild);
            else
                ppfc.appendChild(obj);
            loop++;
        }
    }
}


function htmlToJson(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    function elementToJson(element) {
        const result = {
            tagName: element.tagName.toLowerCase(),
            attributes: {},
            children: []
        };

        // Process attributes
        for (const attr of element.attributes) {
            result.attributes[attr.name] = attr.value;
        }

        // Process child nodes
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

const processedElements = new WeakSet();

function addPipe(elem = document) {
    // Attach global listeners to document
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

function flashClickListener(elem) {
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

function attachEventListeners(elem) {
    if (elem.classList.contains('mouse') || elem.id !== null) {
        let events = (elem.getAttribute("event") || "click").split(';');
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

function hasPipeListener(elem) {
    return elem && typeof elem.onclick === 'function';
}

function test(param1, param2) {
    console.log(param1, param2);
}

function sortNodesByName(selector) {
    const nodes = document.querySelectorAll(selector);
    const nodesArray = Array.from(nodes);

    nodesArray.sort((a, b) => {
        const nameA = a.getAttribute('name') || '';
        const nameB = b.getAttribute('name') || '';
        return nameA.localeCompare(nameB);
    });

    return nodesArray;
}


function pipes(elem, stop = false) {

    var query = "";
    var headers = new Map();
    var formclass = "";
    //
    if (elem.id === null)
        return;

    if (elem.hasAttribute("callback") && typeof window[elem.getAttribute("callback")] === "function") {
        var params = [];
        const calls = sortNodesByName("." + elem.getAttribute("callback-class"));
        Object.keys(calls).forEach((key, n) => {
            params.push(calls[key].getAttribute("value"));
        });
        console.log(params);
        params = params.join(", ");
        window[elem.getAttribute("callback")](params);
    }
    if (elem.classList.contains("redirect"))
        window.location.href = elem.getAttribute("ajax");
    if (elem.classList.contains("disabled"))
        return;
    if (elem.classList.contains("clear-node")) {
        var pages = elem.getAttribute("node").split(";");
        pages.forEach((e) => {
            console.log(e);
            document.getElementById(e).innerHTML = "";
        });
    }

    if (elem.tagName == "lnk") {
        window.open(elem.getAttribute("ajax") + (elem.hasAttribute("query") ? "?" + elem.getAttribute("query") : ""), "_blank");
    }
    if (elem.hasAttribute("display") && elem.getAttribute("display")) {
        var optsArray = elem.getAttribute("display").split(";");
        optsArray.forEach((e, f) => {
            var x = document.getElementById(e);
            if (x !== null && x.style.display !== "none")
                x.style.display = "none";
            else if (x !== null)
                x.style.display = "block";
        });
    }
    if (elem.hasAttribute("turn")) {
        var optsArray = elem.getAttribute("turn");
        var index = 0;
        if (elem.hasAttribute("turn-index")) {
            index = parseInt(elem.getAttribute("turn-index"));
            var interv = elem.getAttribute("interval");
            if (elem.classList.contains("decrIndex"))
                index = Math.abs(parseInt(elem.getAttribute("turn-index").toString())) - interv;
            else
                index = Math.abs(parseInt(elem.getAttribute("turn-index").toString())) + interv;
            if (index < 0)
                index = optsArray.length - 1;
            index = index % optsArray.length;
            elem.setAttribute("turn-index", index.toString());
        }
        else
            elem.setAttribute("turn-index", "0");

        const classLists = document.querySelectorAll("." + elem.getAttribute("turn"));
        classLists.forEach((e, f) => {
            if (f == index) {
                pipes(e);
            }
        });
    }
    if (elem.hasAttribute("x-toggle")) {
        var optsArray = elem.getAttribute("x-toggle").split(";");
        optsArray.forEach((e, f) => {
            var g = e.split(":");
            if (g[0] != '' && g[0] != undefined)
                document.getElementById(g[0]).classList.toggle(g[1]);
        });
    }
    if (elem.hasAttribute("set") && elem.getAttribute("set")) {
        js = elem.getAttribute("set");
        js.split(";").forEach((e, f) => {
            var [id, name, value] = e.split(":");
            if (id != '' && id != undefined)
                document.getElementById(id).setAttribute(name, value);
        });
    }
    if (elem.hasAttribute("get") && elem.getAttribute("get")) {
        js = elem.getAttribute("get");
        js.split(";").forEach((e, f) => {
            var [id, name, target] = e.split(":");
            if (id != undefined && name != undefined && target != undefined) {
                var n = document.getElementById(id).getAttribute(name);
                document.getElementById(target).setAttribute(name, n);
            }
        });
    }
    if (elem.hasAttribute("delete") && elem.getAttribute("delete")) {
        js = elem.getAttribute("delete");
        js.split(";").forEach((e, f) => {
            var [id, name] = e.split(":");
            if (g[0] != '' && g[0] != undefined && g[1] != undefined) {
                document.getElementById(id).removeAttribute(name);
            }
        });
    }
    if (elem.hasAttribute("remove") && elem.getAttribute("remove")) {
        var optsArray = elem.getAttribute("remove").split(";");
        optsArray.forEach((e, f) => {
            var x = document.getElementById(e);
            x.remove();
        });
    }
    if (elem.classList.contains("carousel-step-right")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = false;
            shiftFilesRight(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-step-left")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = false;
            shiftFilesLeft(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-slide-left")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = true;
            shiftFilesLeft(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.classList.contains("carousel-slide-right")) {
        if (elem.hasAttribute("insert")) {
            var x = document.getElementById(elem.getAttribute("insert"));
            auto = true;
            shiftFilesRight(x, auto, parseInt(x.getAttribute("delay")));
        }
    }
    if (elem.hasAttribute("query")) {
        var optsArray = elem.getAttribute("query").split(";");
        var query = "";
        optsArray.forEach((e, f) => {
            var g = e.split(":");
            query = query + g[0] + "=" + g[1] + "&";
        });
        query = query.substring(0, -1);
        // console.log(query);
    }
    if (elem.hasAttribute("headers")) {
        var optsArray = elem.getAttribute("headers").split("&");
        optsArray.forEach((e, f) => {
            var g = e.split(":");
            headers.set(g[0], g[1]);
        });
    }
    if (elem.hasAttribute("form-class")) {
        formclass = elem.getAttribute("form-class");
    }
    if (elem.tagName != "carousel" && elem.hasAttribute("file-order")) {
        fileOrder(elem);
    }
    if (elem.classList.contains("carousel")) {
        var auto = true;
        if (elem.classList.contains("time-active")) {
            auto = true;
        }
        else if (elem.classList.contains("time-inactive")) {
            auto = false;
        }
        carousel(elem, auto);
        return;
    }
    if (elem.classList.contains("ajax-limit")) {
        var parts = elem.getAttribute("ajax").split(";");
        parts.forEach((part) => {
            var [file, target, limit] = part.split(":");
            var clone = elem.cloneNode(true);
            clone.setAttribute("ajax", file);
            clone.setAttribute("insert", target);
            if (limit) {
                clone.setAttribute("boxes", limit);
            }
            navigate(clone, headers, query, formclass);
        });
        return;
    }
    // This is a quick way to make a downloadable link in an href
    //     else
    if (elem.classList.contains("download")) {
        console.log("$$$");
        var text = elem.getAttribute("file");
        var element = document.createElement('a');
        var location = (elem.hasAttribute("directory")) ? elem.getAttribute("directory") : "./";
        element.setAttribute('href', location + encodeURIComponent(text));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return;
    }
    if (elem.hasAttribute("ajax"))
        navigate(elem, headers, query, formclass);
    else if (elem.hasAttribute("modal")) {
        modalList(elem.getAttribute("modal"));
    }
}

function setAJAXOpts(elem, opts) {

    // communicate properties of Fetch Request
    var method_thru = (opts["method"] !== undefined) ? opts["method"] : "GET";
    var mode_thru = (opts["mode"] !== undefined) ? opts["mode"] : '{"Access-Control-Allow-Origin":"*"}';
    var cache_thru = (opts["cache"] !== undefined) ? opts["cache"] : "no-cache";
    var cred_thru = (opts["cred"] !== undefined) ? opts["cred"] : '{"Access-Control-Allow-Origin":"*"}';
    // updated "headers" attribute to more friendly "content-type" attribute
    var content_thru = (opts["content-type"] !== undefined) ? opts["content-type"] : '{"Content-Type":"text/html"}';
    var redirect_thru = (opts["redirect"] !== undefined) ? opts["redirect"] : "manual";
    var refer_thru = (opts["referrer"] !== undefined) ? opts["referrer"] : "referrer";
    opts.set("method", method_thru); // *GET, POST, PUT, DELETE, etc.
    opts.set("mode", mode_thru); // no-cors, cors, *same-origin
    opts.set("cache", cache_thru); // *default, no-cache, reload, force-cache, only-if-cached
    opts.set("credentials", cred_thru); // include, same-origin, *omit
    opts.set("content-type", content_thru); // content-type UPDATED**
    opts.set("redirect", redirect_thru); // manual, *follow, error
    opts.set("referrer", refer_thru); // no-referrer, *client
    opts.set('body', JSON.stringify(content_thru));

    return opts;
}

function formAJAX(elem, classname) {
    var elem_qstring = "";

    console.log(document.getElementsByClassName(classname));
    // No, 'pipe' means it is generic. This means it is open season for all with this class
    for (var i = 0; i < document.getElementsByClassName(classname).length; i++) {
        var elem_value = document.getElementsByClassName(classname)[i];
        elem_qstring = elem_qstring + elem_value.getAttribute('name') + "=" + elem_value.getAttribute('value') + "&";
        // Multi-select box
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
var pretty = 0;
function prettifyJsonWithColors(jsonObj) {
    const prettyJson = JSON.stringify(jsonObj, null, 2);
    if (pretty == 0) {
        // Add CSS to pipes.js or index.html
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

// Usage
function displayColoredJson(elementId, jsonObj) {
    const prettyHtml = prettifyJsonWithColors(jsonObj);
    document.getElementById(elementId).innerHTML = `<pre>${prettyHtml}</pre>`;
}

function navigate(elem, opts = null, query = "", classname = "") {
    //formAJAX at the end of this line
    console.log(elem);
    elem_qstring = query + ((document.getElementsByClassName(classname).length > 0) ? formAJAX(elem, classname) : "");
    //    elem_qstring = elem_qstring;
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
                var allText = "";// JSON.parse(rawFile.responseText);
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
                var allText = "";// JSON.parse(rawFile.responseText);
                try {
                    console.log(rawFile.responseText);
                    var allPretty = JSON.parse(rawFile.responseText);
                    // var allPretty = prettifyJsonWithColors(allText);
                    // allText = JSON.stringify(allText, null, 4);
                    displayColoredJson(elem.getAttribute("insert"), allPretty);
                    if (elem.hasAttribute("insert")) {
                        if (elem.classList.contains("text-html")) {
                            //    document.getElementById(elem.getAttribute("insert")).innerHTML = (JSON.stringify(allPretty));
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
                var allText = "";// JSON.parse(rawFile.responseText);
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
                    // console.log("Error Handling Text");
                }
            }
        }
    }
    else if (elem.classList.contains("plain-text")) {
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                var allText = "";// JSON.parse(rawFile.responseText);
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
                    // console.log("Error Handling Text");
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
                    // editNode.innerHTML = allText;
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
        // console.log(e);
    }
}