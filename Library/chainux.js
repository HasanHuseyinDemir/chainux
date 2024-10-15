export const {html,components,onConnect,onRemove,Render}=(()=>{
const key="#!CHNX!#"
const components = (()=>{
    const map = new Map();
    return {
        get(key,accessKEY) {
            if(accessKEY==$ACCESS){
                if(map.has(key)){
                    return map.get(key);
                }else{
                    console.warn("Component<"+key+"> is not defined!")
                }
            }else{
                console.error("Access Denied!")
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

            if(map.has(key.toLowerCase())){
                console.warn("Component <"+key+"> already set!")
            }
            map.set(key.toLowerCase(), value);
        },
    };
})()

//SYMBOLS
let $CLEANUP=Symbol()
let $APPEND=Symbol()
let $ACCESS=Symbol()
let $SETHOOKS=Symbol()
let $MEMO=Symbol()
let $ID=Symbol()
let $COLLECTION=Symbol()//component içindeki bütün elementleri döndüren fonksiyonun adı e[$COLLECTION]==[div,div....] sadece o componente ait elementleri döndürür tekrar kullanım sağlar

//COMPLETE
new MutationObserver((M)=>{
    M.forEach((m)=>{
        if (m.type=="childList"){
            m.removedNodes.forEach((r)=>{collect(r).forEach(e=>{if(e[$CLEANUP]){e[$CLEANUP]()}})})
            m.addedNodes.forEach((a)=>{collect(a).forEach(e=>{if(e[$APPEND]){e[$APPEND]()}})})
        }
    });
}).observe(document.body,{childList:true,subtree:true});

//TYPES
//COMPLETE
let isImmut=c=>typeof c=="string"||typeof c=="number"
let isObj=c=>c?Object.getPrototypeOf(c)==Object.prototype:!1

//COMPLETE
function destroy(o){
    if(o instanceof Node){
        let c=collect(o)
        c.forEach(e=>e.remove())
        c.forEach(e=>e[$CLEANUP]?e[$CLEANUP]():"")
        c=null
    }else if(typeof o=="object"){
        for(let val in o){
            let t=o[val]
            if(t&&isObj(t)){destroy(t)}
            else if(t instanceof Map){t.forEach((v,k)=>{destroy(v);t.delete(k);})}
            else if(t instanceof Set){t.forEach(v=>{destroy(v)});t.clear()}
            else if(Array.isArray(t)){t.forEach(v=>{destroy(v)})}
            delete o[val]
        }
    }

}
//COMPLETE
function collect(e){
    const ns = [];
    function t(n) {
        if (n.nodeType==1||n.nodeType==3){ns.push(n)}
        if(n.childNodes){
            n.childNodes.forEach(c=>t(c));
        }
    }
    t(e);
    try{
        return [...new Set(ns)];
    }finally{
        t=null
        ns=null
    }
}

const global={
    index:0,//Render ID
    renders:[],
    stateContext:[]
}

//for Components
function Render(f,call){
    global.index++
    let g=global.renders
    g.push[{hooks:{},watchers:[]}]
    let o=f.call(call)//output
    let t=false
    collect(o).forEach(e=>{
        if(!t&&e[$SETHOOKS]){
            e[$SETHOOKS]()
            t=e[$ID]
        }
    })

    if(!t){
        console.error("Render Error! :\nCHNUX Element not detected!")
        g.pop()
    }else{
        collect(o).forEach(e=>{
            //burada aynı iddekileri silmeli sadece!
            if(e[$SETHOOKS]){
                delete e[$SETHOOKS]
            }
        })
    }

    return o
}


//COMPLETE
function HTML(string) {return document.createRange().createContextualFragment(string)}

//COMPLETE
function processElement(element) {
    const W = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while ((n = W.nextNode())) {
        if (n.textContent.includes(key)) {
            replaceKeyWithElement(n);
        }
    }
    W=null
    node=null
}

//<Component class="x" id="y"/> => <Component class="x" id="y"></Component>
//https://gist.github.com/HasanHuseyinDemir/ba781df027f4271ff9aa9b2e978a0afd
//COMPLETE
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

//COMPLETE
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
    range=null
    text=null
    index=null
}

//COMPLETE
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

//COMPLETE but must be a ASYNC
function componentProcess(target){
    let temp=document.createElement("div")
    //slotları documentFragmente aktarmak
    target.replaceWith(temp)
    //sadece this.props,this.slot dışarıdan alınacaktır call edilerek çalıştırılacaktır
    //tekil elementleri render etmek için kullanılır
    let compiled=Render(components.get(target.tagName.toLowerCase(),$ACCESS),this)//isteğe bağlı slot ve proplar işlenebilir
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
    let id=global.index
    let str
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args.length!==i?str+=key:""})
    let fragmented=str.includes("<>")
    str=str.replaceAll("<>", "<div>").replaceAll("</>", "</div>");//TEMPORARY
    if(str.includes("/>")){str=nM(str)}
    let element=HTML(str).firstElementChild
    let collection=[]//Bütün parçalanmış elementler
    let subcomponents=[]
    let fC=false//is first element component?

    let settings={
        eventListeners:new Map(),
        activeWatchers:new Set(),
        stateFunctions:new Set(),
    }

    let qsA=()=>[element,...element.querySelectorAll("*")]
        qsA().forEach((elm)=>{
            if (elm.textContent.includes(key)) {
                processElement(elm)
            }
        })
        function process(elm,i){
            if(components.get(elm.tagName.toLowerCase(),$ACCESS)){
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
                    for (let attr of Array.from(elm.attributes)) {
                        if (elm.getAttribute(attr.name) == key) {
                            let a = args.shift();
                            if(a===undefined){
                                elm.removeAttribute(attr.name)
                                continue
                            }

                            if(attr.name=="use"){
                                elm.removeAttribute("use")
                                a.call(elm,{parent:element})
                                continue
                            }
                            
                            if(attr.name.startsWith(":")){
                                //interactive
                                if(typeof a=="function"){
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


        //BURAYA ÜST DATA ELEMENTLERİNDEN TOPLANILAN VERİLERDE OLMALI

    //}
    subcomponents.forEach(x => {
        let c = componentProcess.call({props: x.values,...collectSlots(x.target),parent:element},x.target);
        if (fC) {element=c}
    });

    //TEMPORARY CLEANUP
    str=null
    //args=null



    if(!fragmented){
        return element
    }else{
        let frag=new DocumentFragment()
        frag.append(...element.childNodes)
        element.remove()
        return frag
    }
}

let hooksGen=new Proxy({},{
    get(_,a){return function(f){
        let t=global.renders
        let last=t[t.length-1]
        if(t.length){
            if(!last.hooks[a])last.hooks[a]=[]
            last.hooks[a].push(f)
        }else{
            console.error(`Chainux HookSet-${a.toUpperCase()} Warn:\nThis hook must be in a component scope!`)
        }
        f=null
        t=null
        last=null
    }}
})
const {onConnect,onRemove,onEffect,onSignal}=hooksGen
hooksGen=null


html.plain=HTML


//HTMLElement.prototype.inner=function(e){this.clear();this.appendChild(e)}

let locked=true

function lock(t){
    locked=t
}

function Data(props){
    let e=html`<div><slot/></div>`
    if(props.name==undefined&&typeof props.name!="string"){
        console.error("Data Component requires a 'name' property of type string to function properly.")
        return e
    }
    e[$MEMO]=true
    let data={[props.name]:props.data}
    e[$ACCESS]=()=>locked?console.error("Access Denied!"):{...data}
    return e
}
components.set("data",Data)


return {html,components,onConnect,onRemove,Render}
})()