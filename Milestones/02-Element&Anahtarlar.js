import { html } from "../Library/chainux.js"
import { Tests } from "../Library/tests.js"

let T=new Tests("Element ve Anahtarlar")

//1.test Yazıları Eklemek
let e1=html`<div>${"Hello World"}</div>`
T.Test("Yazı Anahtarı",()=>{return e1.firstElementChild.textContent==="Hello World"})

//2.test iç içe element sağlıyormu?
function el2(){
    return html`<div>${e1}</div>`
}
T.Test("İç içe element sağlıyormu?",()=>{return el2().firstElementChild===e1})

//3.test iç içe component fonksiyonu sağlıyormu?
function el3(){
    return html`<div>${el2}</div>`
}
T.Test("İç içe component fonksiyonu sağlıyormu?",()=>{
    let ilk=el3().firstElementChild
    return ilk.isSameNode(el2())
})

//4.test attributeler ile tek seferlik eşitleme yapıyormu?
//reaktivite testlerinde ${()=>data.text} ile ifade edilir 
function el4(){
    const data={
        text:"hello"
    }
    return html`<div class="${data.text}"></div>`
}


T.Test("Attributeler ile tek seferlik eşitleme yapıyormu?",()=>{
    let x=el4()
    return x.firstElementChild.className==="hello"
})

export const elementveAnahtarlar=undefined