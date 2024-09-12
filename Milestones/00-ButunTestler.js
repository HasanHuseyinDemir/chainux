//import { elementOlusturma } from "./01-ElementOlusturma.js";
//import { elementveAnahtarlar } from "./02-Element&Anahtarlar.js";

import { html } from "../Library/chainux.js";

let count=0
let node=new Text(count)

function increase(){
    node.nodeValue=++count
}

let h=html`<div onclick=${increase} class="ilk">İlk ${node}</div>`

let s=html`<div class="ikinci">İkinci ${2} ${h}</div>`

let t=html`<div class="uc">UCUNCU ${3} ${s}</div>`

function wrap1(){
    return html`<div class="dort">Dort ${4} ${t}</div>`
}

function wrap2(){
    return html`<div>Beş ${5} ${wrap1}</div>`
}
function wrap3(){
    return html`<div>altı ${"6"} ${wrap2}</div>`
}

document.querySelector("#app").appendChild(wrap3())