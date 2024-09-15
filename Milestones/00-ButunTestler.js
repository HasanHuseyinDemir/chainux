//import { elementOlusturma } from "./01-ElementOlusturma.js";
//import { elementveAnahtarlar } from "./02-Element&Anahtarlar.js";

//import { html,components } from "../Library/chainux.js";
import {html,components} from "../Versions/Chainux-Components/chainux.min.mjs"

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
/*function TestComponent1() {
    return html`
    <div>
        <p>Slot içeriği (default slot):</p>
        <h1><slot></slot></h1>
        
        <p>Slot içeriği (isimli slot):</p>
        <div><slot name="selamlar"></slot></div>
    </div>`;
}*/
//components.set("component",TestComponent1)

function Component2(){
    let name=this.props.name
    let count=0
    function remove(a){
        //arg.parent is components first element
        alert("Goodbye! "+name)
        a.parent.remove()
    }
    function increase(){
        count++
        //this : current element
        console.log(name,count)
        this.querySelector("span").textContent=count
    }

    return html`
    <div style="background-color:#555;color:white;padding:12px;margin:12px;" id=${"parent-of-"+name.toLowerCase()}>
        <h2 
            title="click here to delete root element" 
            onclick=${remove}>
                Hello ${this.props.name}!
        </h2>
        <button 
            title="onclick = increase count" 
            onclick=${increase}>
                Count : <span>${count}</span>
        </button>
    </div>`
}
components.set("component2",Component2)

// TestComponent2 - İçerik sağlar ve slotları kullanır
function TestComponent2() {
    let index=0
    let array=["Chainux","User","Developer","Everyone","Brother","Javascript","Mars","World"]

    function addComponent(argument){
        let template=html`<Component2 name=${array[index%array.length]+" - "+index}></Component2>`
        argument.parent.querySelector("#container").appendChild(template)
        index++
    }

    function set(){
        this.textContent="Çalışıyor!"
        console.log(this)
    }


    return html`
    <div>
        <h1>Component Test</h1>
        <div>
            <button onclick=${addComponent}>AddComponent</button>
            <p use=${set}></p>
        </div>
        <hr>
        <h2>Container</h2>
        <div id="container"></div>
    </div>
    `;
}




document.querySelector("#app").appendChild(TestComponent2())

