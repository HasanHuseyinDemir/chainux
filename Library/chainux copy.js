import { ifs, is, iss } from "./bin/is.js"
export const key="#!CHNX!#"
export const eKey="<chnx></chnx>"

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

    let element = HTML(str).firstElementChild
    console.log(args)
    //chnux işleme
    if(args.length){
        element.querySelectorAll("*").forEach(elm=>{
            if(elm.hasAttributes()){
                for (let attr of elm.attributes) {
                    if(elm.getAttribute(attr.name)==key){
                        //ATTRIBUTE PROCESS
                        elm.setAttribute(attr.name,args.shift())
                    }
                }
            }
            console.log("ARGÜMANLAR" , args.length)
            if(elm.textContent.includes(key)){
                elm.innerHTML=elm.innerHTML.toString().replaceAll(key,eKey)
                elm.querySelectorAll("chnx").forEach(e2=>{
                    let t=args[0]
                    console.log("AMINA KODUMUN T Sİ : "+t)
                    
                    if(is("immutable",t)){
                        t=document.createTextNode(t)
                        e2.replaceWith(t)
                        args.shift()
                        return 
                    }else if(ifs("function",t)){
                        console.log(t.name)
                        t=t()
                        if(iss("element",t)||iss("documentFragment",t)){
                            console.log(t.id)
                            e2.replaceWith(t)
                            args.shift()
                        }
                        
                        return 
                    }else if(iss("element",t)||iss("documentFragment",t)){
                        
                        e2.replaceWith(t)
                        args.shift()
                        return
                    }

                    console.log("ERROR")


                })
            }
            

        })
        //console.log(element.firstElementChild.innerHTML)
    }
    return element
}