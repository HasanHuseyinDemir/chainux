const {html,components}=(()=>{
const key="#!CHNX!#"
const components = componentMixin();
function HTML(string) {return document.createRange().createContextualFragment(string)}

function processElement(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while ((node = walker.nextNode())) {
        if (node.textContent.includes(key)) {
            replaceKeyWithElement(node);
        }
    }
}

//<Component class="x" id="y"/> => <Component class="x" id="y"></Component>
//https://gist.github.com/HasanHuseyinDemir/ba781df027f4271ff9aa9b2e978a0afd
function nM(e) {
    let s = e,
        n = s.split("/>").length - 1,
        r = 0;
    for (; n > r;) {
        let i = s.search("/>") - 1,
            l = 0,
            o = "";
        for (; i - l >= -1;) {
            if ("<" == s.charAt(i - l)) {
                let a = (o = o.split("").reverse().join("")).split(" ")[0],
                    c = `<${a} ${o.replace(a, "") || ""}></${a}>`;
                (s = s.slice(0, i - l) + c + s.slice(i + 3, s.length)), r++, (i = ""), (l = 0), (o = "");
            } else o += s.charAt(i - l);
            l++;
        }
    }
    return s;
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

function componentMixin() {
    const map = new Map();
    return {
        get(key) {
            if(map.has(key)){
                return map.get(key);
            }else{
                console.warn("Component<"+key+"> is not defined!")
            }
        },
        set(key, value) {
            if (typeof key !== 'string') {
                console.error("Key must be a string.");
                return;
            }
            if (typeof value !== 'function') {
                console.error("Value must be a component-function.");
                return;
            }

            if(key.includes(" ")){
                console.error("Component names should not contain spaces.");
                return 
            }
            map.set(key.toLowerCase(), value);
        },
        map
    };
}

function collectSlots(e) {
    let slots = {};
    let frag=new DocumentFragment()
    let sNames=e.querySelectorAll("[slot]")
    sNames.forEach((x)=>{
        slots[x.getAttribute("slot")]=x
        x.removeAttribute("slot")
        x.remove()
    })
    
    Array.from(e.childNodes).forEach(E=>{
        frag.appendChild(E)}
    )
return { slot: frag, slots };
}


function componentProcess(target){
    let temp=document.createElement("div")
    //slotları documentFragmente aktarmak
    target.replaceWith(temp)
    //sadece this.props,this.slot dışarıdan alınacaktır call edilerek çalıştırılacaktır
    //tekil elementleri render etmek için kullanılır
    let compiled=components.get(target.tagName.toLowerCase()).call(this)//isteğe bağlı slot ve proplar işlenebilir
    //render burada olmalı
    if(compiled instanceof HTMLElement){
        //doğru yol
        //slot parçalama işi burada yapılacaktır
        let slotQ=compiled.querySelector('slot:not([name])')
        let slotNQA=compiled.querySelectorAll('slot[name]')
        if(slotQ){slotQ.replaceWith(this.slot)}
        if(slotNQA.length){
            slotNQA.forEach(n=>{
            let name=n.getAttribute("name")
            if(this.slots[name]){
                n.replaceWith(this.slots[name])
            }
            })
        }
        temp.replaceWith(compiled)
    }else{
        console.error("Component-Function output must be a element!")
    }
    return compiled
}

function html(e,...ar){
    let str=""
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args.length!==i?str+=key:""})
    str=str.replaceAll("<>", "<div>").replaceAll("</>", "</div>");
    if(str.includes("/>")){str=nM(str)}
    let fragment = HTML(str)
    let element=fragment.firstElementChild
    let subcomponents=[]
    let qsA=()=>[element,...element.querySelectorAll("*")]
        qsA().forEach(elm=>{
            if (elm.textContent.includes(key)) {
                processElement(elm)
            }
        })
        function process(elm){
            if(components.map.has(elm.tagName.toLowerCase())){
                let values={}
                if(elm.hasAttributes()){
                    for (let attr of Array.from(elm.attributes)) {
                        if (elm.getAttribute(attr.name) == key) {
                            let a=args.shift()
                            values[attr.name]=a
                        }else{
                            values[attr.name]=attr.value
                        }
                    }
                }
                subcomponents.push({target:elm,values})
                return 
            }
            if(args.length){
                if (elm.hasAttributes()) {
                    for (let attr of Array.from(elm.attributes)) {
                        if (elm.getAttribute(attr.name) == key) {
                            let a = args.shift();
                            
                            if(a==undefined){
                                elm.removeAttribute(attr.name)
                                continue
                            }
                            if(attr.name=="use"){
                                elm.removeAttribute("use")
                                a.call(elm,{parent:element})
                                continue
                            }
                            if (attr.name.startsWith("on")) {
                                if (typeof a === "function") {
                                    elm.addEventListener(attr.name.slice(2), ()=>a.call(elm,{parent:element}));
                                }
                                elm.removeAttribute(attr.name)
                            } else {
                                elm.setAttribute(attr.name, a);
                            }
                        }
                    }
                }
                
                if(elm.tagName==="CHNX"){
                    let t=args.shift()
                    if(t==undefined){
                        elm.remove()
                        return
                    }
                    if(!(t instanceof Object)){//immutable
                        elm.replaceWith(document.createTextNode(t))
                        return 
                    }
                    if(typeof t=="function"){
                        t=t()
                        if(t instanceof Node){
                            elm.replaceWith(t)
                        }
                        if(!(t instanceof Object)){
                            elm.replaceWith(new Text(t))
                        }
                        return 
                    }
                    if(t instanceof Node){
                        elm.replaceWith(t)
                        return
                    }
                }
            }
        }
        qsA().forEach(process)
    //}
    subcomponents.forEach(x => {
        let c = componentProcess.call({props: x.values,...collectSlots(x.target),parent:element},x.target);
        if (x.target === element) {
            element=c
        }
    });
    return element
}
return {html,components}
})()