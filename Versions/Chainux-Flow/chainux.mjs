export const {html,components,onConnect,onRemove,Render,Data,IStore}=(()=>{
const key="#!CHNX!#"
const components = componentMixin();
/*Interact*/
//lifecycle hooks
//html.plain
HTMLElement.prototype.clear=function(){this.textContent="";return this}
HTMLElement.prototype.hide=function(a){this.style.display==a?"none":this.style.display;return this};
HTMLElement.prototype.show=function(a){this.style.display==a?"block":this.style.display;return this};
Object.defineProperty(HTMLElement.prototype,"text",{
    set:function(v){this.textContent=v},
    get:function(){return this.textContent},
});
HTMLElement.prototype.addClass=function(c){this.classList.add(c);return this}
HTMLElement.prototype.removeClass=function(c){this.classList.remove(c);return this}
HTMLElement.prototype.toggleClass=function(c){this.classList.toggle(c);return this}
HTMLElement.prototype.setStyle = function(styles) {
    for (let key in styles) {
        let value=styles[key];
        if (typeof value=="function") {
            value=value.call(this);
        }
        if (this.style[key]!=value) {
            this.style[key]=value;
        }
    }
    return this;
};
HTMLElement.prototype.set = function(p,arg){
    if(p.style){
        if(typeof p.style=="object"&&typeof p.style!="function"){
            this.setStyle(p.style)
        }else{
            this.style=typeof p.style=="function"?p.style.call(this):p.style
        }
    }
    for (let key in p) {
        if(key!="callback"&&key!="style"){
            if (key.startsWith("on")){
                this[key]=p[key].bind(this)
                continue
            }
            let value=p[key];
            if(typeof value=="function") {
                let result=value.call(this,arg);
                if (this[key]!==result){
                    this[key]=result;
                }
            } 
            else if(key in this) {
                if (this[key]!==value) {
                    this[key]=value;
                }
            } 
            else{
                if(this.getAttribute(key)!==value) {
                    this.setAttribute(key,value);
                }
            }
        }
    }
    if(p.callback){
        if(typeof p.callback=="function"){
            p.callback.call(this)
        }else{
            console.warn("Set Callback Must Be a Function!")
        }
    }
    return this
};

let index=0
function IStore(obj,ca){//Interactive Store || NON REACTIVE
    let c=ca//callback
    let id=index++
    if(!observer){
        defineMObserver()
    }
    return new Proxy(obj,{
        get(t,k){
            return t[k]
        },
        set(t,k,v){
            let before=t[k]
            if(t[k]!=v){
                t[k]=v
                let call={before,current:v,key:k,id}
                hooks.mountedISElements.forEach((val,key)=>{key.set(val,call)})//Update!
                if(c){
                    c.call(call)
                }
            }
            return 1
        }
    })
}

const hooks={
    temp:{},
    elementHooksPair:new WeakMap(),
    elementDataPair:new WeakMap(),
    elementISPair:new WeakMap(),//interactive state pair
    mountedISElements:new Map(),//Ekle sil işlemleri mount unmount ile yapılır!
    eMSG:"Component onConnect & onRemove hooks must be a function!"
}

//Element için onSee gibi özellikler eklenebilir
//WIP + onEvent + Dispatch(document.bodyden bütün sayfaya veya istenen noktaya)
function Data(d) {
    return hooks.temp.data=d
}
Data.hasData=function(e){
    return hooks.elementDataPair.has(e)
}
Data.getData=function(e){
    if(Data.hasData(e)){return hooks.elementDataPair.get(e)}
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
                    if (node instanceof HTMLElement) {                        
                        [node,...node.querySelectorAll("*")].forEach(e=>{
                            if(hooks.elementISPair.has(e)){
                                let data=hooks.elementISPair.get(e)
                                hooks.mountedISElements.set(e,data)
                                e.set(data)
                            }
                            callHook("connect",e)
                        })
                    }
                });
                mutation.removedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        [node,...node.querySelectorAll("*")].forEach(e=>{
                            if(hooks.mountedISElements.has(e)){
                                hooks.mountedISElements.delete(e)
                            }
                            callHook("remove",e)
                        })
                    }
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
    let str
    let data=hooks.temp.data
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args.length!==i?str+=key:""})
    str=str.replaceAll("<>", "<div>").replaceAll("</>", "</div>");
    if(str.includes("/>")){str=nM(str)}
    let fragment = HTML(str)
    let element=fragment.firstElementChild
    let subcomponents=[]
    let fC=false//is first element component?
    let qsA=()=>[element,...element.querySelectorAll("*")]
        qsA().forEach((elm,i)=>{
            if (elm.textContent.includes(key)) {
                processElement(elm)
            }
        })
        function process(elm,i){
            if(components.map.has(elm.tagName.toLowerCase())){
                let values={}
                if(i==0){fC=true}
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
                    let settable=!1
                    let setter={}//
                    for (let attr of Array.from(elm.attributes)) {
                        if (elm.getAttribute(attr.name) == key) {
                            let a = args.shift();
                            if(a===undefined){
                                elm.removeAttribute(attr.name)
                                continue
                            }

                            if(attr.name=="use"){
                                elm.removeAttribute("use")
                                a.call(elm,{parent:element,data})
                                continue
                            }
                            
                            if(attr.name.startsWith(":")){
                                //interactive
                                if(typeof a=="function"){
                                    settable=true
                                    setter[attr.name.slice(1)]=a.bind(elm)
                                }else{
                                    elm.set({[attr.name.slice(1)]:a})//
                                }
                                elm.removeAttribute(attr.name)
                                continue 
                            }
                            
                            if(attr.name=="set"){
                                elm.set(a)
                                elm.removeAttribute("set")
                                continue
                            }
                            if(attr.name.startsWith("on")) {
                                if (typeof a=="function") {
                                    elm.addEventListener(attr.name.slice(2), ()=>a.call(elm,{parent:element,data}));
                                }
                                elm.removeAttribute(attr.name)
                                continue
                            }
                            if(typeof a=="function"){
                                elm.setAttribute(attr.name,a.call(this))
                                continue
                            }
                            elm.setAttribute(attr.name, a);
                        }
                    }
                    if(settable){
                        hooks.elementISPair.set(elm,setter)
                        //elm.set(setter) //mount edildiğinde çalışması yeterli
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
        if (fC) {element=c}
    });
    return element
}

html.plain=function(e){
    return HTML(e)
}
HTMLElement.prototype.inner=function(e){this.clear();this.appendChild(e)}

return {html,components,onConnect,onRemove,Render,Data,IStore}
})()