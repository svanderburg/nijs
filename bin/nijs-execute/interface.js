var optparse = require('optparse');
var operations = require('./operations.js');

/* Define command-line options */

var switches = [
    ['-h', '--help', 'Shows help sections'],
    ['-o', '--output', 'Change the output path in which build packages are stored'],
    ['-A', '--attr NAME', 'Selects an instance of the top-level packages module'],
    ['--tmpdir', 'Change the temp dir location in which immediate artifacts are stored']
];

var parser = new optparse.OptionParser(switches);

/* Set some variables and their default values */

var help = false;
var output = null;
var attr = null;
var tmpdir = null;

/* Define process rules for option parameters */

parser.on('help', function(arg, value) {
    help = true;
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

operations.nijsExecute({
    filename : filename,
    attr : attr,
    output : output,
    tmpdir : tmpdir
});
