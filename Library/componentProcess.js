const ctw = (e) => document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, !1)

//vanilla yöntem içindir
function listAttributes(element) {
    const attributes = element.attributes;
    const attributesList = [];
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        attributesList.push({
            name: attr.name,
            value: attr.value
        });
    }
    return attributesList;//[{},{}]...
}

export function componentMixin() {
    const map = new Map();
    return {
        get(key) {
            if(map.has(key)){
                return map.get(key);
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
            map.set(key, value);
            //vanilla tipi component eşleme callbacki yapılabilir

            document.querySelectorAll(key).forEach(e=>{
                let slotData=collectSlots(e)
                componentProcess.call({props:listAttributes(e),slot:slotData.slot,slots:slotData.slots})//vanilla yöntem 
            })
            //html fonksiyonunda farklı işleme tabi tutulacaktır
        },
        has:map.has,
    };
}


export function collectSlots(e){
    let fragment=new DocumentFragment()
    let tw=ctw(e)
    let slots={}
    while((tw.nextNode())){
        let current=tw.currentNode
        if(current instanceof HTMLElement&&current.hasAttribute("slot")){
            let slotName=current.getAttribute("slot")
            current.removeAttribute("slot")
            let f=new DocumentFragment()
            let tw2=ctw(current)
            while(tw2.nextNode()){
                f.appendChild(tw2.currentNode)
            }
            slots[slotName]=f
        }
        fragment.appendChild(tw.currentNode)
    }
    return {slot:fragment,slots}
}

export async function componentProcess(target,func){
    let temp=new HTMLDivElement()
    //slotları documentFragmente aktarmak
    target.replaceWith(temp)
    //sadece this.props,this.slot dışarıdan alınacaktır call edilerek çalıştırılacaktır
    //tekil elementleri render etmek için kullanılır
    let compiled=await func.call(this)//isteğe bağlı slot ve proplar işlenebilir

    if(compiled instanceof HTMLElement){
        //doğru yol
        //slot parçalama işi burada yapılacaktır
        /*if(current instanceof HTMLElement&&current.tagName=="SLOT"){}*/
        let slotQ=compiled.querySelector("slot")
        let slotNQA=compiled.querySelectorAll("[slot]")
        if(this.slot.childNodes.length&&slotQ){
            slotQ.replaceWith(this.slot)
        }
        if(slotNQA.length){
            slotNQA.forEach(n=>{
                let sName=n.getAttribute("slot")

            })
        }


        ///END
        temp.replaceWith(compiled)
    }else{
        console.error("Function output must be a element!")
    }

}

            /*

            şimdiki fonksiyonun işlevi
            <component>
                <div slot="Hello">....</div>
                <div></div>
            </component>
            
            =>

            process
            <div>
                <slot name="Hello"></slot>
                <slot></slot> //div gelir
            </div>
            
            */