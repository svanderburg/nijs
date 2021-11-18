var child_process = require('child_process');
var path = require('path');

function wrapInterface(interfaceFile) {
    /* Set the command-line arguments */
    var args = process.argv;

    /* Take the node interpreter path */
    var nodeCommand = args.shift();

    /* Discard the node script */
    args.shift();

    /* Determine the path to the interface */
    var interfacePath = path.join(path.dirname(module.filename), interfaceFile);

    /* Compose command line arguments to invoke the interface */
    args = [ interfacePath ].concat(args);

    /*
     * Compose environment that contains nijs and its dependencies in the NODE_PATH
     * environment variable
     */
    var nijsPath = path.resolve(path.join(path.dirname(module.filename), "..", ".."));

    var newEnv = process.env;

    if(newEnv.NODE_PATH === undefined || newEnv.NODE_PATH == "")
        newEnv.NODE_PATH = nijsPath + path.delimiter + path.join(nijsPath, "nijs", "node_modules");
    else
        newEnv.NODE_PATH = nijsPath + path.delimiter + path.join(nijsPath, "nijs", "node_modules") + path.delimiter + newEnv.NODE_PATH;

    /* Spawn the interface process */
    var nijsBuildProcess = child_process.spawn(nodeCommand, args, { env: newEnv });

    nijsBuildProcess.stdout.on("data", function(data) {
        process.stdout.write(data);
    });

    nijsBuildProcess.stderr.on("data", function(data) {
        process.stderr.write(data);
    });

    nijsBuildProcess.on("exit", function(code) {
        process.exit(code);
    });

}

exports.wrapInterface = wrapInterface;
