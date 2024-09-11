import { html } from "../Library/chainux.js";
import { Tests } from "../Library/tests.js";

let T=new Tests("Html Element Oluşturma")
T.Test("Html Element Oluşturuldumu?",()=>{
    let el=html`<div></div>`    
    return (el.firstElementChild instanceof HTMLElement)
})

export const elementOlusturma=undefined