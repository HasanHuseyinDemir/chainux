export function is(arg, data) {
    switch (arg) {
        case "immutable":
            return (typeof data === "string" || typeof data === "number" || typeof data === "boolean");
        case "number":
            return typeof data === "number";
        case "string":
            return typeof data === "string";
        case "boolean":
            return typeof data === "boolean";
        case "null":
            return data === null;
        case "undefined":
            return typeof data === "undefined";
        case "symbol":
            return typeof data === "symbol";
        case "array":
            return Array.isArray(data);
        case "object":
            return typeof data === "object" && data !== null && !Array.isArray(data);
        case "class":
            return typeof data === "function" && /^\s*class\s+/.test(data.toString());
        case "element":
            return data instanceof HTMLElement;
        case "function":
            return typeof data === "function";
        case "promise":
            return data instanceof Promise;
        case "date":
            return data instanceof Date && !isNaN(data.getTime());
        case "regexp":
            return data instanceof RegExp;
        case "map":
            return data instanceof Map;
        case "set":
            return data instanceof Set;
        case "weakmap":
            return data instanceof WeakMap;
        case "weakset":
            return data instanceof WeakSet;
        case "nan":
            return typeof data === "number" && isNaN(data);
        case "finite":
            return typeof data === "number" && isFinite(data);
        case "bigint":
            return typeof data === "bigint";
        case "error":
            return data instanceof Error;
        case "iterable":
            return data != null && typeof data[Symbol.iterator] === "function";
        default:
            return false;
    }
}

export function iss(data) {
    let types = [];

    if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
        types.push("immutable");
    }
    if (typeof data === "number") {
        types.push("number");
    }
    if (typeof data === "string") {
        types.push("string");
    }
    if (typeof data === "boolean") {
        types.push("boolean");
    }
    if (data === null) {
        types.push("null");
    }
    if (typeof data === "undefined") {
        types.push("undefined");
    }
    if (typeof data === "symbol") {
        types.push("symbol");
    }
    if (Array.isArray(data)) {
        types.push("array");
    }
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        types.push("object");
    }
    if (typeof data === "function" && /^\s*class\s+/.test(data.toString())) {
        types.push("class");
    }
    if (data instanceof HTMLElement) {
        types.push("element");
    }
    if (typeof data === "function") {
        types.push("function");
    }
    if (data instanceof Promise) {
        types.push("promise");
    }
    if (data instanceof Date && !isNaN(data.getTime())) {
        types.push("date");
    }
    if (data instanceof RegExp) {
        types.push("regexp");
    }
    if (data instanceof Map) {
        types.push("map");
    }
    if (data instanceof Set) {
        types.push("set");
    }
    if (data instanceof WeakMap) {
        types.push("weakmap");
    }
    if (data instanceof WeakSet) {
        types.push("weakset");
    }
    if (typeof data === "number" && isNaN(data)) {
        types.push("nan");
    }
    if (typeof data === "number" && isFinite(data)) {
        types.push("finite");
    }
    if (typeof data === "bigint") {
        types.push("bigint");
    }
    if (data instanceof Error) {
        types.push("error");
    }
    if (data != null && typeof data[Symbol.iterator] === "function") {
        types.push("iterable");
    }
    return types;
}

export function ifs(control,data){
    return iss(data).includes(control)
}