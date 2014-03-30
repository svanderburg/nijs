var optparse = require('optparse');
var operations = require('./operations.js');

/* Define command-line options */

var switches = [
    ['-h', '--help', 'Shows help sections'],
    ['--show-trace', 'Causes Nix to print out a stack trace in case of Nix expression evaluation errors'],
    ['-K', '--keep-failed', 'Specifies that in case of a build failure, the temporary directory should not be deleted'],
    ['-o', '--out-link FILE', 'Change the name of the symlink to the output path created from result to outlink'],
    ['-A', '--attr NAME', 'Selects an instance of the top-level packages object'],
    ['--no-out-link', 'Do not create a symlink to the output path'],
    ['--eval-only', 'Causes the tool to only generate a Nix expression without evaluating it'],
    ['--async', 'Indicates whether the deployment modules are defined asynchronously']
];

var parser = new optparse.OptionParser(switches);

/* Set some variables and their default values */

var help = false;
var showTrace = false;
var keepFailed = false;
var outLink = null;
var attr = null;
var noOutLink = false;
var evalOnly = false;
var executable = "";
var filename = null;
var async = false;

/* Define process rules for option parameters */

parser.on('help', function(arg, value) {
    help = true;
});

parser.on('show-trace', function(arg, value) {
    showTrace = true;
});

parser.on('keep-failed', function(arg, value) {
    keepFailed = true;
});

parser.on('out-link', function(arg, value) {
    outLink = value;
});

parser.on('attr', function(arg, value) {
    attr = value;
});

parser.on('no-out-link', function(arg, value) {
    noOutLink = true;
});

parser.on('eval-only', function(arg, value) {
    evalOnly = true;
});

parser.on('async', function(arg, value) {
    async = true;
});

/* Define process rules for non-option parameters */

parser.on(1, function(opt) {
    executable = opt;
});

parser.on(2, function(opt) {
    filename = opt;
});

/* Do the actual command-line parsing */

parser.parse(process.argv);

/* Display the help, if it has been requested */

if(help) {
    function displayTab(len, maxlen) {
        for(var i = 0; i < maxlen - len; i++) {
            process.stdout.write(" ");
        }
    }

    process.stdout.write("Usage:\n\n");
    process.stdout.write(executable + " [options] -A package pkgs.js\n\n");
    process.stdout.write("Options:\n\n");
    
    var maxlen = 20;
    
    for(var i = 0; i < switches.length; i++) {
    
        var currentSwitch = switches[i];
        
        if(currentSwitch.length == 3) {
            process.stdout.write(currentSwitch[0] + ", "+currentSwitch[1]);
            displayTab(currentSwitch[0].length + 2 + currentSwitch[1].length, maxlen);
            process.stdout.write(currentSwitch[2]);
        } else {
            process.stdout.write(currentSwitch[0]);
            displayTab(currentSwitch[0].length, maxlen);
            process.stdout.write(currentSwitch[1]);
        }
        
        process.stdout.write("\n");
    }
    
    process.exit(0);
}

/* Verify the input parameters */

if(filename === null) {
    process.stderr.write("No packages CommonJS module is specified!\n");
    process.exit(1);
}

if(attr === null) {
    process.stderr.write("No package has been selected!\n");
    process.exit(1);
}

/* Perform the desired operation */

if(evalOnly) {
    operations.evaluateModule({
        filename : filename,
        attr : attr,
        async : async
    });
} else {
    operations.nijsBuild({
        filename : filename,
        attr : attr,
        showTrace : showTrace,
        keepFailed : keepFailed,
        outLink : outLink,
        noOutLink : noOutLink,
        async : async
    });
}
