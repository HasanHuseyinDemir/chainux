export const passLog=new Map()
export const errorLog=new Map()

let debug=false

export class Tests {
    constructor(name) {
        this.name = name;
        this.index = 0; 
        this.pass = 0;  
        this.error = 0;
        passLog.set(this.name,[])
        errorLog.set(this.name,[])
        this.passLogs=passLog.get(this.name)
        this.errorLogs=errorLog.get(this.name)
    }
    Test(describe, test) {
        if (this.index == 0) {
            debug?console.log("TEST START: " + this.name):""
        }
        this.index++;
        let result;
        try {
            result = test();
            let exp=`Test ${this.index}: ${describe} : ${result?"PASS":"ERROR"}`
            debug?console.log(exp):""
            if (result) {
                this.passLogs.push(exp)
                this.pass++;
            } else {
                this.errorLogs.push(exp)
                this.error++;
            }
        } catch (e) {
            let exp=`Test ${this.index}: ${describe} : ERROR - ${e.message}`
            debug?console.log(exp):""
            this.errorLogs.push(exp)
            this.error++;
        }
    }
    Results() {
        console.log("\nTEST RESULTS:");
        console.log(`Total Tests: ${this.index}`);
        console.log(`Passed: ${this.pass}`);
        console.log(`Failed: ${this.error}`);

        if (this.error === 0) {
            console.log("ALL TESTS PASSED!");
        } else {
            console.log(`ERRORS: ${this.error}`);
        }
    }
    
}
