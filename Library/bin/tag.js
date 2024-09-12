//belki lazım olur
export function tag(s, ...v) {
    let f = [];
    for (let i = 0; i < s.length; i++) {
        f.push(s[i]);
        if (i < v.length) {
            f.push(v[i]);
        }
    }
    return {strings: s,keys: v,full: f};
}