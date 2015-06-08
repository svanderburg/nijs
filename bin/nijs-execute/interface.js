var fs = require('fs');
var path = require('path');
var optparse = require('optparse');
var operations = require('./operations.js');

/* Define command-line options */

var switches = [
    ['-h', '--help', 'Shows help sections'],
    ['-v', '--version', 'Shows the version'],
    ['-o', '--output', 'Change the output path in which build packages are stored'],
    ['-A', '--attr NAME', 'Selects an instance of the top-level packages module'],
    ['--tmpdir', 'Change the temp dir location in which immediate artifacts are stored']
];

var parser = new optparse.OptionParser(switches);

/* Set some variables and their default values */

var help = false;
var version = false;
var output = null;
var attr = null;
var tmpdir = null;

/* Define process rules for option parameters */

parser.on('help', function(arg, value) {
    help = true;
});

parser.on('version', function(arg, value) {
    version = true;
});

parser.on('output', function(arg, value) {
    output = value;
});

parser.on('attr', function(arg, value) {
    attr = value;
});

parser.on('tmpdir', function(arg, value) {
    tmpdir = value;
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

    process.stdout.write("Usage: " + executable + " [options] -A package pkgs.js\n\n");
    
    process.stdout.write("Directly executes the a given CommonJS module defining a set of package\n");
    process.stdout.write("configurations, making it possible to directly build NiJS packages without the\n");
    process.stdout.write("Nix package manager.\n\n");
    
    process.stdout.write("Options:\n");
    
    var maxlen = 20;
    
    for(var i = 0; i < switches.length; i++) {
    
        var currentSwitch = switches[i];
        
        process.stdout.write("  ");
        
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

/* Display the version, if it has been requested */

if(version) {
    var versionNumber = fs.readFileSync(path.join("..", "..", "version"));
    process.stdout.write(executable + " (nijs "+versionNumber+")\n\n");
    process.stdout.write("Copyright (C) 2012-2015 Sander van der Burg\n");
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

operations.nijsExecute({
    filename : filename,
    attr : attr,
    output : output,
    tmpdir : tmpdir
});
