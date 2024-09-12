const key="#!CHNX!#"
const eKey="<chnx></chnx>"

export const components = componentMixin();
function HTML(string) {return document.createRange().createContextualFragment(string)}

export function html(e,...ar){
    let str=""
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args[i]?str+=key:""})    
    let fragment = HTML(str)
    let element=fragment.firstElementChild
    if(args.length){
        [element,...element.querySelectorAll("*")].forEach(elm=>{if(elm.textContent.includes(key)){elm.innerHTML=elm.innerHTML.toString().replaceAll(key,eKey)}})
        function process(elm){
            if (elm.hasAttributes()) {
                for (let attr of elm.attributes) {
                    if (elm.getAttribute(attr.name) == key) {
                        let a = args.shift();
                        if (attr.name.startsWith("on")) {
                            if (typeof a === "function") {
                                elm.addEventListener(attr.name.slice(2), a);
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
                if(typeof t!="object"){//immutable
                    elm.replaceWith(document.createTextNode(t))
                    return 
                }
            }

        }
        [element,...element.querySelectorAll("*")].forEach(process)
    }
    return element
}