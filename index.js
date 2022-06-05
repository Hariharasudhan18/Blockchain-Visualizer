const express = require("express");
const sha256 = require("sha256");
const bodyParser = require("body-parser");
const hbs = require("hbs");

class Block {
    constructor(index, data, prevHash){
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.prevHash = prevHash;
        this.currHash = this.mineHash();
    }
    
    // POW
    mineHash() {
        var nonce = 0;
        var hash = "";

        while(!this.verifyHash(hash)) {
            hash = sha256(nonce + this.data)
            nonce += 1;
        }

        return hash;
    }

    verifyHash(hash) {
        return hash.startsWith("0" * 3)
    }
}

class Blockchain {
    constructor() {
        console.log("Blockchain is getting created")
        this.blockchain = [this.createGeneisBlock()]
    }

    createGeneisBlock() {
        return new Block(0, "Genesis Block", "0")
    }

    addNewBlock(data) {
        var block = new Block(this.getLastIndex() + 1, data, this.getLastHash());
        this.blockchain.push(block);
    }
    getLastIndex() {
        return this.blockchain[this.blockchain.length -1].index;
        // return this.blockchain.at(-1).index;
    }

    getLastHash() {
        return this.blockchain[this.blockchain.length -1].currHash;
    }
}

var chain = new Blockchain();
chain.addNewBlock("First Block")
chain.addNewBlock("second Block")
// console.log(chain)

// express code
var app = express();
app.use(bodyParser.json({type: '*'}))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "hbs");
app.set("views", __dirname);

app.get("/", (req, res) => {
    res.render('index', {blockchain: chain.blockchain})
});

app.post("/", (req, res) => {
    chain.addNewBlock(req.body.data)
    res.render('index', {blockchain: chain.blockchain})
})

app.listen(3000, () => {
    console.log("Hey, the port is un and running. connect to http://localhost:3000")
})