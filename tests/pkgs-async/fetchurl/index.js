var path = require('path');
var fs = require('fs');
var nijs = require('nijs');

exports.pkg = function(args) {
  return function(funArgs, callback) {
    /* Determine the component's name */
    var urlString;
  
    if(typeof funArgs.url == "string")
        urlString = funArgs.url;
    else if(funArgs.url instanceof nijs.NixURL)
        urlString = funArgs.url.value;
    else
        callback("The specified url is in an unknown format!");
    
    var name;
  
    if(funArgs.name === undefined)
        name = path.basename(urlString);
    else
        name = funArgs.name;

    /* Check whether the right output hash is specified */
  
    var outputHashAlgo;
    var outputHash;
  
    if(funArgs.md5 !== undefined && funArgs.md5 != "") {
        outputHashAlgo = "md5";
        outputHash = funArgs.md5;
    } else if(funArgs.sha1 !== undefined && funArgs.sha1 != "") {
        outputHashAlgo = "sha1";
        outputHash = funArgs.sha1;
    } else if(funArgs.sha256 !== undefined || funArgs.sha256 != "") {
        outputHashAlgo = "sha256";
        outputHash = funArgs.sha256;
    } else {
        callback("No output hash specified! Specify either 'md5', 'sha1', or 'sha256'!");
    }
    
    /* Pick the right list of mirrors, in case a mirror:// url has been specified */
  
    if(urlString.substring(0, "mirror://".length) == "mirror://") {

        /* Open mirrors config file */
        var mirrorsConfigFile = path.join(path.dirname(module.filename), "mirrors.json");
        var mirrorsConfig = JSON.parse(fs.readFileSync(mirrorsConfigFile));
    
        /* Determine the mirror identifier */
        var urlPath = urlString.substring("mirror://".length - 1);
        var mirrorComponent = urlPath.match(/\/[a-zA-Z0-9_]+\//);
        var mirror = mirrorComponent.toString().substring(1, mirrorComponent.toString().length - 1);
      
        /* Determine the relative path to the file */
        var filePath = urlPath.substring(mirrorComponent.toString().length);
      
        /* Append the file to each mirror */
      
        mirrors = mirrorsConfig[mirror];
      
        for(var i = 0; i < mirrors.length; i++) {
            mirrors[i] = mirrors[i] + filePath;
        }
    
      } else {
          mirrors = [ funArgs.url ];
      }
  
    /* Create the derivation that specifies the build action */

    args.stdenv().mkDerivation({
        name : name,

        mirrors : mirrors,

        builder : new nijs.NixFile({
            value : "./builder.sh",
            module : module
        }),

        outputHashAlgo : outputHashAlgo,
        outputHash : outputHash,
    
        PATH : process.env['PATH'],
    
        /*
         * We borrow these environment variables from the caller to allow easy proxy
         * configuration. This is impure, but a fixed-output derivation like fetchurl
         * is allowed to do so since its result is by definition pure.
         */
        impureEnvVars : [ "http_proxy", "https_proxy", "ftp_proxy", "all_proxy", "no_proxy" ],
    
        /*
         * Doing the download on a remote machine just duplicates network
         * traffic, so don't do that */
        preferLocalBuild : true,
    
        /* We use the host system's curl, which does not work in a chroot */
        __noChroot : true
      }, callback);
    };
};
