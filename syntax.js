const fs = require('fs')
const ohm = require('ohm-js');
const semanticsHandlers = require("./handlers");

class HTTPParser {
    constructor(output) {
        this.grammar = ohm.grammar(fs.readFileSync("grammar.ohm", "utf-8"))
        this.semantics = this.grammar.createSemantics()
        this.semantics.addOperation("eval()", {
            CommandBlock(commands, _) {
                semanticsHandlers.commandBlockHandler(commands, output)
            }
        });
    }
}

module.exports = {
    HTTPParser
}