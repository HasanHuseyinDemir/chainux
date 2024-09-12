function nM(e) {
    let s = e,
        n = s.split("/>").length - 1,
        r = 0;
    for (; n > r;) {
        let i = s.search("/>") - 1,
            l = 0,
            o = "";
        for (; i - l >= -1;) {
            if ("<" == s.charAt(i - l)) {
                let a = (o = o.split("").reverse().join("")).split(" ")[0],
                    c = `<${a} ${o.replace(a, "") || ""}></${a}>`;
                (s = s.slice(0, i - l) + c + s.slice(i + 3, s.length)), r++, (i = ""), (l = 0), (o = "");
            } else o += s.charAt(i - l);
            l++;
        }
    }
    return s;
}

export function rP(e) {
    let s = e.replaceAll("<>", "<div>").replaceAll("</>", "</div>");
    return (s = s.includes("/>") ? nM(s) : s).replaceAll(/\#\!CHNX\!#/g, t.t);
}