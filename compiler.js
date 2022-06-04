const fs = require('fs')
const syntax = require("./syntax");

function run() {
    var argv = require('minimist')(process.argv.slice(2));
    if (argv._.length < 1) {
        console.log("Missing input file!")
        return   
    }

    const inputFile = argv._[0]
    if (!fs.existsSync(inputFile)) {
        console.log(`File ${inputFile} does not exist!`)
        return
    }

    var output = ""
    if (argv.o && argv.output) {
        console.log("Use either -o or --output, not both")
        return
    }

    if (argv.o) {
        output = argv.o
    }

    if (argv.output) {
        output = argv.output
    }

    const content = fs.readFileSync(inputFile)
    const parser = new syntax.HTTPParser(output)
    const matchResult = parser.grammar.match(content)
    if (matchResult.succeeded()) {
        parser.semantics(matchResult).eval();
    } else {
        console.log(`Syntax error: ${matchResult.message}`)
    }
}

run()