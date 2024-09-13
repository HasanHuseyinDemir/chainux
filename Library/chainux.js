const key="#!CHNX!#"

export const components = componentMixin();
function HTML(string) {return document.createRange().createContextualFragment(string)}

const ctw = (e) => document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, !1)//Bütün Elementler

//vanilla yöntem içindir
function listAttributes(element) {
    const attributes = element.attributes;
    const list = {};
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        list[attr.name]=attr.value
    }
    return list;//{....}...
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
            map.set(key, value);
            //vanilla tipi component eşleme callbacki yapılabilir

            document.querySelectorAll(key).forEach(e=>{componentProcess.call({props:listAttributes(e),...collectSlots(e)},e)})//vanilla
            //html fonksiyonunda farklı işleme tabi tutulacaktır
        },
        map
    };
}

let l=console.log

export function collectSlots(e) {
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


export function componentProcess(target){
    let temp=document.createElement("div")
    //slotları documentFragmente aktarmak
    target.replaceWith(temp)
    //sadece this.props,this.slot dışarıdan alınacaktır call edilerek çalıştırılacaktır
    //tekil elementleri render etmek için kullanılır
    let compiled=components.get(target.tagName.toLowerCase()).call(this)//isteğe bağlı slot ve proplar işlenebilir
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
//wrapped private function
function wF(_){return function(...a){_(...a)}}

export function html(e,...ar){
    let str=""
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args[i]?str+=key:""})    
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
                            if (attr.name.startsWith("on")) {
                                if (typeof a === "function") {
                                    elm.addEventListener(attr.name.slice(2), wF(a));
                                    elm.removeAttribute(attr.name)
                                }
                            } else {
                                elm.setAttribute(attr.name, a);
                            }
                        }
                    }
                }
                
                if(elm.tagName==="CHNX"){
                    let t=args.shift()
                    if(!(t instanceof Object)){//immutable
                        elm.replaceWith(document.createTextNode(t))
                        return 
                    }
                    if(typeof t=="function"){
                        t=t()
                        if(t instanceof Node){
                            elm.replaceWith(t)
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
        let c = componentProcess.call({props: x.values,...collectSlots(x.target)},x.target);
        if (x.target === element) {
            element=c
        }
    });
    return element
}