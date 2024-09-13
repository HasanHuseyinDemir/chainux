# Tanıtım : Chainux-Basic

Chainux-Basic, Chainux sürümlerinin vanilla javascript ile uyumlu, hızlı ve öğrenmesi kolay bir versiyonudur. Temel öğeleri ve işlevleri içerir, böylece web geliştirme sürecinizi basit ve etkili bir şekilde yönetmenizi sağlar. Özellikle basit projeler ve temel uygulamalar için ideal bir seçimdir. Öğrenme eğrisini en aza indirir ve hızlı prototipleme ile uygulama geliştirmeyi kolaylaştırır.

Chainux-Basic, birden fazla anahtarı bir araya getirerek büyük HTML dosyalarını yönetmenize olanak tanır. Bu yaklaşım, karmaşık ve büyük HTML yapılarında içerik ve olay yönetimini kolaylaştırır.

## Örnekler
### Tekil HTML Elementi

```javascript

let element = html`<button onclick=${() => alert("Button Clicked")}>Click</button>`;

document.querySelector("#app").appendChild(element)

```

Bu örnek, bir button HTML elementi oluşturur. Butona tıklandığında bir uyarı mesajı (alert) görüntülenir. html fonksiyonu, template literal (şablon literali) kullanarak HTML içeriği oluşturur. Bu tekil elementtir ve sadece bir butondan oluşur.
### Elementi Sarmalama

```javascript
function wrap1() {
    return html`
    <div>
        <h1>Merhaba Dünya!</h1>
        <div>${element}</div>
    </div>`;
}
```

Bu örnekte, daha önce tanımlanan element (buton) bir div içine sarılır. wrap1 fonksiyonu çağrıldığında, element öğesi div elementinin içinde yer alır. Yani, element (buton) şimdi bir div içerisinde olacaktır. Bu, HTML içeriğini sarmak için kullanışlıdır.
### Componentleri Sarmalama

```javascript

function wrap2() {
    return html`<div>${wrap1}</div>`;
}

```

Bu örnekte, wrap1 fonksiyonunu çağırarak, element ile sarılmış div öğesini oluşturur ve bunu bir başka div içerisine sarar. Bu, wrap1 fonksiyonunun sonucunu alıp, onu başka bir HTML elementinin içine yerleştirir. wrap1 fonksiyonunun kendisi (wrap1) yerine çağrıldığında (wrap1()) kullanılabilir. İki yöntem de aynı sonucu verir. Bu, iç içe komponentler veya elementlerle çalışmanın bir yoludur.

### Vanilla Uygun Yapı

```javascript

function component() {
    let page = html`<div></div>`;
    page.textContent = "Hello World";
    return page;
}

```

Bu örnekte, component fonksiyonu bir div elementi oluşturur ve içeriğini "Hello World" olarak ayarlar. Bu, vanilla javascript ile HTML elementleri oluşturmanın ve içeriği dinamik olarak değiştirmenin basit bir yolunu gösterir.
### İsteğe Bağlı Prop ile Kullanım

```javascript

function sub_component(arg) {
    return html`<div>${arg}</div>`;
}

function root_component() {
    return html`<div>${sub_component("hello world")}</div>`;
}

document.querySelector("#app").appendChild(root_component());
```

Bu örnekte, sub_component fonksiyonu bir div içerisine arg parametresini yerleştirir. root_component fonksiyonu ise sub_component fonksiyonunu çağırarak "hello world" metnini içerir. Bu yapı, bileşenlere (component) prop (özellik) geçirme işlemi sağlar. sub_component fonksiyonuna bir argüman geçirerek, dinamik içerik oluşturabilirsiniz.