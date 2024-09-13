//import { elementOlusturma } from "./01-ElementOlusturma.js";
//import { elementveAnahtarlar } from "./02-Element&Anahtarlar.js";

import { html,components } from "../Library/chainux.js";
/*
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

document.querySelector("#app").appendChild(wrap3())*/

//sade bir çağırım
//Slotları alır ve gösterir
function TestComponent1() {
    return html`
    <div>
        <p>Slot içeriği (default slot):</p>
        <h1><slot></slot></h1>
        
        <p>Slot içeriği (isimli slot):</p>
        <div><slot name="selamlar"></slot></div>
    </div>`;
}

function Component2(){
    let c=this.props.click
    return html`
    <div>
    ${undefined}
        <h1 onclick=${this.props.click}>Hello ${"Hello"} ${2} ${1}</h1>
    </div>`
}
components.set("component2",Component2)

// TestComponent2 - İçerik sağlar ve slotları kullanır
function TestComponent2() {
    return html`
    <div>
    <Component2 click=${()=>{console.log("bu bir")}} name="Hasan"/>
    <Component2 click=${()=>{console.log("bu iki")}} name="Zeynep"/>
    <Component2/>

    <Component class="as" temp=${"a"} obj=${{ x: 1 }}>
        Merhaba Dünya!
        <button onclick=${()=>alert("Hello")}>Selam</button>
        <p slot="selamlar">Selamlar, bu P elementi bir slot kullanıyor!</p>
    </Component>
    </div>

    
    `;
}


components.set("component",TestComponent1)

document.querySelector("#app").appendChild(TestComponent2())

