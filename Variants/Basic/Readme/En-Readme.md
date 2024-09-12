# Chainux-Basic: Introduction

Chainux-Basic is a fast, easy-to-learn version of Chainux that is fully compatible with vanilla JavaScript. It includes basic elements and functions, enabling you to manage your web development process simply and efficiently.

Chainux-Basic is an ideal choice for simple projects and fundamental applications, minimizing the learning curve and facilitating rapid prototyping and application development.
## Examples
### Single HTML Element

```javascript
let element = html`<button onclick=${() => alert("Button Clicked")}>Click</button>`;

document.querySelector("#app").appendChild(element)

```

This example creates a button HTML element. When the button is clicked, it displays an alert message. The html function utilizes template literals to generate HTML content. This is a single element, consisting only of a button.
### Wrapping the Element

```javascript
function wrap1() {
    return html`<div>${element}</div>`;
}
```

In this example, the previously defined element (button) is wrapped within a div. When the wrap1 function is called, the element is placed inside the div element. This is useful for wrapping HTML content.
### Wrapping Components

```javascript
function wrap2() {
    return html`<div>${wrap1}</div>`;
}

```

This example calls the wrap1 function, which creates the div element containing the element, and wraps it within another div. This effectively takes the output of the wrap1 function and places it inside another HTML element. Note that wrap1 is used without parentheses here, unlike wrap1(). Both methods achieve the same result. This approach is useful for working with nested components or elements.
### Vanilla Compliant Structure

```javascript
function component() {
    let page = html`<div></div>`;
    page.textContent = "Hello World";
    return page;
}
```

In this example, the component function creates a div element and sets its content to "Hello World". This demonstrates a straightforward way to create HTML elements and dynamically modify their content using vanilla JavaScript.
### Usage with Optional Prop

```javascript      
function sub_component(arg) {
    return html`<div>${arg}</div>`;
}

function root_component() {
    return html`<div>${sub_component("hello world")}</div>`;
}

document.querySelector("#app").appendChild(root_component());
```

This example showcases passing props (properties) to components. The sub_component function places the arg parameter within a div. The root_component function calls sub_component with the text "hello world". By passing arguments to the sub_component function, you can create dynamic content.