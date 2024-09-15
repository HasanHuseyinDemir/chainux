let html = (() => {
    const key = "#!CHNX!#"
    function HTML(string) { return document.createRange().createContextualFragment(string) }
    function processElement(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.textContent.includes(key)) {
                replaceKeyWithElement(node);
            }
        }
    }
    function replaceKeyWithElement(textNode) {
        const range = document.createRange();
        let text = textNode.textContent;
        let index = 0;
        while (text.includes(key)) {
            const startIndex = text.indexOf(key, index);
            const endIndex = startIndex + key.length;
            range.setStart(textNode, startIndex);
            range.setEnd(textNode, endIndex);
            range.deleteContents();
            const newElement = document.createElement("chnx");
            range.insertNode(newElement);
            text = textNode.textContent;
            index = startIndex + "<chnx></chnx>".length;
        }
    }
    function html(e, ...ar) {
        let str = ""
        let args = [...ar]
        e.forEach((a,i)=>{str+=a;args.length!==i?str+=key:""})
        let fragment = HTML(str)
        let element = fragment.firstElementChild
        let a = () => [element, ...element.querySelectorAll("*")]
        if (args.length) {
            a().forEach(elm => {
                if (elm.textContent.includes(key)) {
                    processElement(elm)
                }
            })
            function process(elm) {
                if (elm.hasAttributes()) {
                    for (let attr of elm.attributes) {
                        if (elm.getAttribute(attr.name) == key) {
                            let a = args.shift();
                            if (attr.name.startsWith("on")) {
                                if (typeof a === "function") {
                                    elm.addEventListener(attr.name.slice(2), ()=>a.call(elm,{parent:element}));
                                    elm.removeAttribute(attr.name)
                                }
                            } else {
                                elm.setAttribute(attr.name, a);
                            }
                        }
                    }
                }
                if (elm.tagName === "CHNX") {
                    let t = args.shift()
                    if (t instanceof Node) {
                        elm.replaceWith(t)
                        return
                    }
                    if (typeof t == "function") {
                        t = t()
                        if (t instanceof Node) {
                            elm.replaceWith(t)
                        }
                        return
                    }
                    if (typeof t != "object") {//immutable
                        elm.replaceWith(document.createTextNode(t))
                        return
                    }
                }
            }
            a().forEach(process)
        }
        return element
    }
    return html
})()
export { html }