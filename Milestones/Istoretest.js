import { IStore,html } from "../Library/chainux.js";

const store=IStore({
x:0,
y:1
},function(){console.log(this)})
window.store=store

function Main(){
    function setInput(){
        this.addEventListener("input",function(){
            console.time("Eşleme")
            store.x=this.value
            console.timeEnd("Eşleme")
        })
    }

    let div=document.createElement("div")
    for(let i=0;i<2;i++){
        div.appendChild(html`<p :text=${()=>{return store.x}}/>`)
    }
    for(let i=0;i<10000;i++){
        div.appendChild(html`<p>Merhaba</p>`)
    }

    return html`
    <div>
        <input test=${()=>store.x} HELLO=${"Selam"} use=${setInput} :value=${()=>{ console.log("Güncellendi");return store.x}}>
        ${div}
    </div>`
}

document.querySelector("#app").appendChild(Main())