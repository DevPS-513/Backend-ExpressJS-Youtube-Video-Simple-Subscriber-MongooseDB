// utils.js
const mongoose = require('mongoose');

class SampleGenerator {

    constructor(schema){
        this.schema = new mongoose.Schema( schema);
        this.sampleJson={}
        this.sampleEntry={}
    }
    generate() {
        for (let key in this.schema.paths) {
            let path = this.schema.path(key);
            let fieldInfo = {
                type: path.instance,
                required: path.isRequired || false,
            };

            this.sampleJson[key]=fieldInfo
            this.sampleEntry[key]=null            
        }
    }
}





const generateSampleJson=(schema) => {
    let sampleJson={};
    let sampleEntry={};
    for (let key in schema.obj) {
        let fieldInfo = {
            type: schema.obj[key].type.name,
            required: schema.obj[key].required 
        };

        sampleJson[key]=fieldInfo
        sampleEntry[key]= null
    }
    return sampleJson
}

module.exports = {SampleGenerator,generateSampleJson};