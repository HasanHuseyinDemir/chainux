# Chainux

Chainux is a JavaScript library designed for reactive and dynamic HTML creation using template literals. It allows you to build and update HTML content efficiently while supporting reactivity and dynamic attribute handling.

## Features

- **HTML Creation with Template Literals**: Create dynamic HTML content using template literals.
- **Dynamic Attribute Updates**: Update attribute values dynamically using specific keys.
- **Reactive System**: Designed with reactive programming principles to enhance performance and user experience.

## Installation

The project is currently in development and may not have all features fully implemented. To use Chainux, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone Coming SOON
    ```

2. **Install Dependencies** (if applicable):
    ```bash
    npm install "*"
    ```

## Usage

You can use Chainux to create HTML content and dynamically update attributes as follows:

### Example Usage

```javascript
import { html } from "./path/to/chainux.js";

// Adding Text
let e1 = html`<div>${"Hello World"}</div>`;

// Nested Element Support
function el2() {
    return html`<div>${e1}</div>`;
}

// Nested Component Function Support
function el3() {
    return html`<div>${el2} or ${el2()}</div>`;
}

// Single-time Attribute Assignment
function el4() {
    const data = {
        text: "hello"
    };
    return html`<div class="${data.text}"></div>`;
}
