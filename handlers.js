const fs = require('fs');
const dataStructs = require("./dataStructures");

function commandBlockHandler(blockNode, output) {
    context = new dataStructs.Context()
    for (i = 0; i < blockNode.numChildren; i++) {
        try {
            commandHandler(context, blockNode.child(i))
        } catch (err) {
            console.log(`Semantic parsing error: ${err}`)
            return
        }
    }
    
    var result = ""
    Object.keys(context.variables).forEach(key => {
        result += `====================\n${key}\n\n${context.getVariable(key).build()}\n\n====================\n\n`
    })

    if (output === "") {
        console.log(result)
    } else {
        fs.writeFileSync(output, result)
    }
}

function commandHandler(context, commandNode) {
    var childNode = commandNode.child(0)
    switch (childNode.ctorName) {
        case 'Command_declaration':
            var varName = childNode.child(0).child(0).sourceString
            var varMethod = childNode.child(0).child(2).sourceString
            var varUrl = childNode.child(0).child(3).sourceString
            var newV = new dataStructs.Variable(varMethod, varUrl)
            context.addVariable(varName, newV)
            break
        case 'Command_add_header':
            var varName = childNode.child(0).sourceString
            var headerKey = childNode.child(2).sourceString
            var headerValue = childNode.child(3).sourceString
            var existingV = context.getVariable(varName)
            existingV.addHeader(headerKey, headerValue)
            context.updateVariable(varName, existingV)
            break
        case 'Command_add_query_param':
            var varName = childNode.child(0).sourceString
            var paramKey = childNode.child(2).sourceString
            var paramValue = childNode.child(3).sourceString
            var existingV = context.getVariable(varName)
            existingV.addQueryParam(paramKey, paramValue)
            context.updateVariable(varName, existingV)
            break
        case 'Command_add_body':
            var varName = childNode.child(0).sourceString
            var body = childNode.child(2).sourceString
            var existingV = context.getVariable(varName)
            existingV.addBody(body)
            context.updateVariable(varName, existingV)
            break
        case 'Command_remove_header':
            var varName = childNode.child(0).sourceString
            var headerKey = childNode.child(2).sourceString
            var existingV = context.getVariable(varName)
            existingV.removeHeader(headerKey)
            context.updateVariable(varName, existingV)
            break
        case 'Command_remove_param':
            var varName = childNode.child(0).sourceString
            var paramKey = childNode.child(2).sourceString
            var existingV = context.getVariable(varName)
            existingV.removeQueryParam(paramKey)
            context.updateVariable(varName, existingV)
            break
        case 'Command_remove_body':
            var varName = childNode.child(0).sourceString
            var existingV = context.getVariable(varName)
            existingV.removeBody()
            context.updateVariable(varName, existingV)
            break
        case 'Command_comment':
            break
        default:
            console.log(`Unrecognized command ${childNode.sourceString}: ${childNode.ctorName}`)
            break
    }
}

module.exports = {
    commandHandler,
    commandBlockHandler,
}