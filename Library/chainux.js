import { is } from "./bin/is.js"
let key="#!CHNX!#"



export function HTML(s){
    return document.createRange().createContextualFragment(s)
}

export function html(e,...ar){
    let str=""
    let args=[...ar]
    let cI=0//currentIndex
    e.forEach((a,i)=>{
        str+=a
        args[i]?str+=key:""
    })

    let element = HTML(str)
    
    //chnux işleme
    if(args.length){
        element.querySelectorAll("*").forEach(elm=>{
            if(elm.hasAttributes()){
                for (let attr of elm.attributes) {
                    console.log(elm.getAttribute(attr.name))
                    if(elm.getAttribute(attr.name)==key){
                        elm.setAttribute(attr.name,args[cI])
                        cI++
                    }
                }
            }
        })
    }
    console.log(element)
    return element
}