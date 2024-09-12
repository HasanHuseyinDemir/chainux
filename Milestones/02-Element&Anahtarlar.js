import { html } from "../Library/chainux.js"
import { Tests } from "../Library/tests.js"

let T=new Tests("Element ve Anahtarlar")

let app=document.querySelector("#app")

//1.test Yazıları Eklemek
let e1=html`<div id="1">A ${"Hello World"} <div>${"burası gözükmemesi lazım"}</div></div>`
T.Test("Yazı Anahtarı",()=>{return e1.firstElementChild.textContent==="Hello World"})

//2.test iç içe element sağlıyormu?
function el2(){
    return html`<div id="2">Burası Element Eklemeli! :${"TEST"} -${e1}- ${"TEST2"}</div>`
}
//T.Test("İç içe element sağlıyormu?",()=>{return el2().cloneNode(true).isSameNode(e1.cloneNode(true))})
//3.test iç içe component fonksiyonu sağlıyormu?

function el3(){
    return html`<div id="3">HELLO ${el2} ${"Merhaba"} ${2} ${4}</div>`
}


app.append(el3())
console.log(e1)
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
    return html`<div id="4" class="${data.text}"></div>`
}


T.Test("Attributeler ile tek seferlik eşitleme yapıyormu?",()=>{
    let x=el4()
    return x.firstElementChild.className==="hello"
})

export const elementveAnahtarlar=undefined