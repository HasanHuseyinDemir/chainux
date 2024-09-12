import { ifs, is, iss } from "./bin/is.js"
export const key="#!CHNX!#"
export const eKey="<chnx></chnx>"

export function HTML(string) {
    return document.createRange().createContextualFragment(string)
}

export function html(e,...ar){
    let str=""
    let args=[...ar]
    e.forEach((a,i)=>{str+=a;args[i]?str+=key:""})
    
    let element = HTML(str)
    //chnux işleme
    if(args.length){
        //pre
        element.querySelectorAll("*").forEach(elm=>{if(elm.textContent.includes(key)){elm.innerHTML=elm.innerHTML.toString().replaceAll(key,eKey)}})

        function process(elm){
            //debugger;
            if(elm.hasAttributes()){for (let attr of elm.attributes) {if(elm.getAttribute(attr.name)==key){elm.setAttribute(attr.name,args.shift())}}}
            if(elm.tagName.toLowerCase()==="chnx"){
                let t=args.shift()

                if(is("immutable",t)){
                    elm.replaceWith(document.createTextNode(t))
                    return 
                }

                if(t instanceof Node){
                    elm.replaceWith(t)
                    return
                }

                if(ifs("function",t)){
                    t=t()
                    if(t instanceof Node){
                        if(t.querySelectorAll&&t.querySelectorAll("chnx").length){
                            process(t)
                        }
                        elm.replaceWith(t)
                    }
                    return 
                }

            }
        }
        element.querySelectorAll("*").forEach(process)
        //console.log(element.firstElementChild.innerHTML)
    }
    return element
}