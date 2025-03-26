# DotPipe.js Comprehensive Attribute, Class, and Tag Guide

## Attributes

1. insert
   Common: ajax="foo.bar" insert="targetDiv"

2. ajax
   Common: ajax="getData.php"
   Uncommon: ajax="getData.php;processData.php;displayData.php"
   Advanced: ajax="streamData.php" data-stream-type="server-sent-events"

3. query
   Common: query="name:John&age:30"
   Uncommon: query="filters:{category:'books',price:{min:10,max:50}}&sort:price"

4. turn
   Common: turn="slide1;slide2;slide3"

5. callback
   Common: callback="displayResults"

6. callback-class
   Common: callback-class="result-item"

7. modal (used strictly in conjuction with modal-JSON)
   Common: class="modala" ajax="modalContent.json:modalContainer"
   Uncommon: class="modala" ajax="login-form.json:modalContainer;registration-form.json:secondaryModal"

8. download
   Common: class="download" file="document.pdf"

9. file
    Common: class="download" file="image.jpg"

10. set
    Common: set="targetId:innerHTML:Hello, World!"

11. get
    Common: get="sourceId:textContent"
    Uncommon: get="form1:serializedData;form2:formData"

12. delete
    Common: delete="tempElement:class"

13. remove
    Common: remove="tempMessage"
    Uncommon: remove="notification1;notification2;notification3"

14. display
    Common: display="contentPanel;toggled-display-id"
    
15. form-class
    Common: form-class="login-form"
    
16. time-active
    Common: class="time-active auto-update"

17. time-inactive
    Common: class="time-inactive"

18. delay
    Common: delay="5000"

19. file-order
    Common: file-order="img1.jpg;img2.jpg;img3.jpg"

20. file-index
    Common: file-index="0"

21. boxes
    Common: boxes="3"

22. class-index
    Common: class-index="0"

23. turn-index
    Common: turn-index="0"

24. interval
    Common: interval="1"

25. tool-tip
    Common: tool-tip="Click to submit"

26. sources
    Common: sources="img1.jpg;img2.jpg;img3.jpg"

27. event
    Common: event="click"
    Uncommon: event="click;mouseover;touchstart"

28. mode
    Common: mode="POST"

29. directory
    Common: directory="/images/"

30. iter
    Common: iter="1"

31. auto
    Common: auto="true"

32. type
    Common: type="image"

## Classes

1. mouse
   Common: class="mouse" <insert attributes to create interaction>
   Uncommon: class="mouse" event="mouseenter;mouseleave"  <insert attributes to create interaction>

2. download
   Common: class="download" file="file.ext"
   Uncommon: class="download secure" file="foo.ext" directory="secure-dir/"

3. redirect
   Common: class="redirect"

4. clear-node
   Common: class="clear-node"

5. multi-part
   Common: class="multi-part"

6. carousel
   Common: class="carousel"

7. carousel-step-right, carousel-step-left
   Common: class="carousel-step-right"

8. carousel-slide-left, carousel-slide-right
   Common: class="carousel-slide-left"

9. modala
    Common: class="modala"

10. modala-multi-first, modala-multi-last
    Common: class="modala-multi-first"

11. tree-view
    Common: class="tree-view"

12. dyn-one, dyn-done
    Common: class="dyn-one"
    Uncommon: class="dyn-one reusable"
    Advanced: class="dyn-one" data-lifecycle="managedInstance" data-cleanup="intelligentGC"

13. incrIndex, decrIndex
    Common: class="incrIndex"
    Uncommon: class="incrIndex loop"
    Advanced: class="incrIndex" data-step="fibonacci" data-bounds="circular"

14. plain-text, plain-html
    Common: class="plain-text"

15. json
    Common: class="json"
    Uncommon: class="json schema-validate"
    Advanced: class="json" data-transform="jmespath" data-viewer="interactiveJsonExplorer"

16. disabled
    Common: class="disabled"
    Uncommon: class="disabled with-overlay"
    Advanced: class="disabled" data-reactiv

17. carousel-vert
    Common: class="carousel-vert"
    Uncommon: class="carousel-vert snap-scroll"

18. strict-json
    Common: class="strict-json"

## Custom Tags

1. <pipe>
   Common: <pipe ajax="getData.php">
   Uncommon: <pipe ajax="getData.php" query="type:advanced">
   Advanced: <pipe ajax="getData.php" query="type:advanced&type-set:arial" callback="processData">

2. <dyn>
   Common: <dyn ajax="updateContent.php">

3. <timed>
   Common: <timed ajax="refreshData.php" delay="10000">

4. <carousel>
   Common: <carousel sources="img1.jpg;img2.jpg;img3.jpg">
   Uncommon: <carousel sources="img1.jpg;img2.jpg;img3.jpg" auto="true" delay="3000">

5. <lnk>
   Common: <lnk ajax="page.html">Link Text</lnk>
   Uncommon: <lnk ajax="page.html" target="_blank">External Link</lnk>
   Advanced: <lnk ajax="page.html" preload="hover" analytics="track-clicks" accessibility="aria-described">Smart Link</lnk>

These expanded descriptions of attributes, classes, and custom tags in DotPipe.js showcase the library's versatility in creating dynamic, interactive web applications with minimal traditional HTML. The advanced use cases demonstrate how DotPipe.js can be extended to handle complex scenarios, paving the way for more sophisticated markup languages and web development paradigms.

# DotPipe.js Advanced Usage Examples

## Example 1: Dynamic Content Carousel with Lazy Loading

This example creates a responsive image carousel with lazy loading and adaptive refresh rates.

```json
{
  "tagname": "div",
  "class": "carousel carousel-images",
  "id": "dynamic-image-carousel",
  "boxes": "3",
  "auto": "true",
  "delay": "3000",
  "type": "image",
  "sources": "img1.jpg;img2.jpg;img3.jpg",
  "children": [
    {
      "tagname": "div",
      "class": "carousel-controls",
      "children": [
        {
          "tagname": "button",
          "id": "prev-button",
          "class": "carousel-step-left",
          "textContent": "Previous"
        },
        {
          "tagname": "button",
          "id": "next-button",
          "class": "carousel-step-right",
          "textContent": "Next"
        }
      ]
    }
  ]
}

```

This carousel dynamically loads images, adapts its refresh rate based on user interaction, and implements lazy loading for improved performance.

Example 2: Multi-step Form with Dynamic Validation
This example creates a multi-step form with dynamic content loading and real-time validation.

```html
<div class="multi-part" id="registration-form">
    <dyn 
         id="form-content-1"
         class="form-step mouse" 
         ajax="step1.php" 
         insert="form-content" 
         callback="validateStep1"
         event="submit"
         form-class="registration-fields">
    </dyn>
    <dyn 
         id="form-content-2"
         class="form-step mouse" 
         ajax="step2.php" 
         insert="form-content" 
         callback="validateStep2"
         event="submit"
         form-class="registration-fields">
    </dyn>
    <dyn
         id="form-content-3"
         class="form-step mouse" 
         ajax="step3.php" 
         insert="form-content" 
         callback="validateStep3"
         event="submit"
         form-class="registration-fields">
    </dyn>
</div>
<div id="form-content"></div>
<div class="form-navigation">
    <button id="previous" class="decrIndex" turn="form-step" turn-index="0">Previous</button>
    <button id="next" class="incrIndex" turn="form-step" turn-index="0">Next</button>
</div>
```

This multi-step form loads content dynamically, performs client-side validation, and allows navigation between steps.

Example 3: Real-time Data Dashboard with Error Handling
This example creates a dashboard that updates in real-time and handles potential errors gracefully.

```html
<div class="dashboard-container">
    <timed class="data-widget json" 
           ajax="realtimeData.php" 
           delay="5000" 
           insert="widget-content" >
    </timed>
    <div id="widget-content"></div>
    <div class="widget-controls">
        <button x-toggle="widget-content:paused">Pause Updates</button>
        <button event="click" ajax="refreshData.php" insert="widget-content">Force Refresh</button>
    </div>
</div>
```
This dashboard widget fetches real-time data, formats it using a custom transformer, and provides controls for pausing updates or forcing a refresh.

Example 4: Interactive Tree View with Lazy Loading
This example creates an interactive tree view that lazily loads child nodes and supports searching.

```json
{
  "tagname": "div",
  "class": "tree-container",
  "children": [
    {
      "tagname": "input",
      "type": "text",
      "class": "tree-search",
      "placeholder": "Search..."
    },
    {
      "tagname": "ul",
      "class": "tree-view",
      "ajax": "getRootNodes.php",
      "children": [
        {
          "tagname": "li",
          "class": "tree-item",
          "textContent": "Root Node 1",
          "children": [
            {
              "tagname": "ul",
              "class": "sub-tree",
              "children": [
                {
                  "tagname": "li",
                  "class": "tree-item",
                  "textContent": "Child Node 1.1"
                },
                {
                  "tagname": "li",
                  "class": "tree-item",
                  "textContent": "Child Node 1.2"
                }
              ]
            }
          ]
        },
        {
          "tagname": "li",
          "class": "tree-item",
          "textContent": "Root Node 2"
        }
      ]
    }
  ]
}

```

This tree view loads child nodes, implements custom node rendering, and supports fuzzy search functionality.

These examples demonstrate how DotPipe.js attributes and classes can be combined to create complex, interactive web components with minimal traditional HTML markup.