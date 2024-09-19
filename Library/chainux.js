export const {html,components,DebugMode,onConnect,onRemove,Render,Data,getData}=(()=>{
const key="#!CHNX!#"
const components = componentMixin();
/*Interact*/
//lifecycle hooks
const ind={
    index:0,
    createIndex(){
        return this.index++
    }
}

const hooks={
    temp:{},
    elementHooksPair:new WeakMap(),
    elementDataPair:new WeakMap(),
    eMSG:"Component onConnect & onRemove hooks must be a function!"
}

//Element için onSee gibi özellikler eklenebilir
//WIP + onEvent + Dispatch(document.bodyden bütün sayfaya veya istenen noktaya)
function Data(d) {
    return hooks.temp.data=d
}

function hasData(e){
    return hooks.elementDataPair.has(e)
}

function getData(e){
    if(hasData(e)){return hooks.elementDataPair.get(e)}
}
/*WIP Lazy Component Loading is best for optimizations
function lazyComponent(e){
    hooks.lazyComponent=e??true
}
*/

let observer
function defineMObserver(){
    observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation=>{
            if (mutation.type == "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {[node,...node.querySelectorAll("*")].forEach(e=>callHook("connect",e))}
                });
                mutation.removedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {[node,...node.querySelectorAll("*")].forEach(e=>callHook("remove",e))}
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function defineHook(n,f){if(typeof f=="function"){hooks.temp[n]=f}else{console.warn(hooks.eMSG)};/*for optimization*/if(!observer){defineMObserver()}}

function callHook(m,e){//method element
    let target=hooks.elementHooksPair
    if(target.has(e)&&target.get(e)[m]){target.get(e)[m].call(e,e)}
}

let onConnect=f=>{defineHook("connect",f)}
let onRemove=f=>{defineHook("remove",f)}
let c=()=>{hooks.temp.connect=null;hooks.temp.remove=null;hooks.temp.data=null}//ClearHooks

//for Components
function Render(f,call){
    c()
    let o=f.call(call)//output
    let {remove,connect,data}=hooks.temp
    if(connect||remove){
        hooks.elementHooksPair.set(o,{remove,connect})
    }
    if(data){
        hooks.elementDataPair.set(o,data)
    }
    c()
    return o
}


/**/
function HTML(string) {return document.createRange().createContextualFragment(string)}
//const ctw = (e) => document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, !1)//Bütün Elementler
let isPrivate=1
function DebMode(b/*<boolean>*/) {
    // Debug option for developers
    // not for "components" version
    isPrivate=!b;
    if (b) {
        window.components=components;
        window.html=html;
    }
    // Note: Future versions may include additional features and improvements
    // such as enhanced debugging tools, configuration options, and extended
    // component functionalities. Keep an eye on the release notes for updates.
}

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
    let compiled=Render(components.get(target.tagName.toLowerCase()),this)//isteğe bağlı slot ve proplar işlenebilir
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
    let data=hooks.temp.data
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args.length!==i?str+=key:""})
    str=str.replaceAll("<>", "<div>").replaceAll("</>", "</div>");
    if(str.includes("/>")){str=nM(str)}
    let fragment = HTML(str)
    let element=fragment.firstElementChild
    let subcomponents=[]
    let qsA=()=>[element,...element.querySelectorAll("*")]
        qsA().forEach((elm,i)=>{
            if (elm.textContent.includes(key)) {
                processElement(elm)
            }
        })
        function process(elm){
            if(components.map.has(elm.tagName.toLowerCase())){
                let values={}
                if(elm.hasAttributes()){
                    for (let attr of elm.attributes) {
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
                    for (let attr of elm.attributes) {
                        if (elm.getAttribute(attr.name) == key) {
                            let a = args.shift();
                            
                            if(a==undefined){
                                elm.removeAttribute(attr.name)
                                return
                            }
                            if(attr.name=="use"){
                                elm.removeAttribute("use")
                                a.call(elm,{parent:element,data})
                                return 
                            }
                            if (attr.name.startsWith("on")) {
                                if (typeof a === "function") {
                                    elm.addEventListener(attr.name.slice(2), ()=>a.call(elm,{parent:element,data}));
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
                        t=t.call({parent:element,data})
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
        let c = componentProcess.call({props: x.values,...collectSlots(x.target),parent:element,data},x.target);
        if (x.target === element) {
            element=c
        }
    });
    return element
}
return {html,components,DebugMode:DebMode,onConnect,onRemove,Render,Data,getData}
})()