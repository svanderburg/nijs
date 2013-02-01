NiJS: An internal DSL for Nix in JavaScript
===========================================
Many programming language environments provide their own language specific
package manager, implementing features that are already well supported by
generic ones. This package is a response to that phenomenon.

This package contains a library and command-line utility providing an internal
DSL for the [Nix package manager](http://nixos.org/nix) in JavaScript. Nix is a
generic package manager that borrows concepts from purely functional programming
languages to make deployment reliable, reproducible and efficient. It serves as
the basis of the [NixOS](http://nixos.org/nixos) Linux distribution, but it can
also be used seperately on regular Linux distributions, FreeBSD, Mac OS X and
Windows (through Cygwin).

The internal JavaScript DSL makes it possible for developers to convienently
perform deployment operations, such as building, upgrading and installing
packages with the Nix package manager from JavaScript programs. Moreover,
it offers a number of additional features.

Prerequisites
=============
* In order to use the components in this package, a [Node.js](http://nodejs.org) installation is required.
* To use the `nijs-build` command-line utility, we require the [optparse](https://github.com/jfd/optparse-js) library to be installed either through Nix or NPM

Installation
============
To install this package, either the NPM package manager or the Nix package
manager can be used.

In order to be able to use the `nijsFunProxy` function from Nix expressions, it
would be useful to add the following value to the `NIX_PATH` environment variable
in your shell's profile, e.g. `~/.profile`:

    $ export NIX_PATH=$NIX_PATH:nijs=/path/to/nijs/lib

Usage
=====
This package offers a number of interesting features.

Calling a Nix function from JavaScript
--------------------------------------
The most important use case of this package is to be able to call Nix functions
from JavaScript. To call a Nix function, we must create a simple proxy that
translates the JavaScript function call to a string with a Nix function call.
The `nixToJS()` function is very useful for this purpose -- it takes a
JavaScript object and translates these to Nix expression language objects.

The following code fragment demonstrates a JavaScript function proxy that
proxies a call to the `stdenv.mkDerivation` function in Nix:

    var nijs = require('nijs');

    function mkDerivation(args) {
        return {
            _type : "nix",
            value : "pkgs.stdenv.mkDerivation "+nijs.jsToNix(args)
        };
    }

As can be observed, a function proxy has a very simple structure. It always
returns an object with a `_type` field that is set to `nix` and a value
representing a string that contains a generated Nix expression. To generate a
function call, we have to provide the function name and the arguments. The
arguments can be generated automatically by converting the arguments of the
JavaScript function (which are JavaScript objects) to Nix language object by
using the `jsToNix()` function.

Specifying packages
-------------------
The `stdenv.mkDerivation` is a very important function in Nix. It's directly and
indirectly used by nearly every package specification to perform a build from
source code. In the `tests/` folder, we have defined a packages repository:
`pkgs.js` that provides a proxy to this function.

By using this proxy we can also describe our own package specifications in
JavaScript, instead of the Nix expression language. Every package build recipe
can be written as a CommonJS module, that may looks as follows:

    exports.pkg = function(args) {
      return args.stdenv().mkDerivation ({
        name : "hello-2.8",
    
        src : args.fetchurl({
          url : "mirror://gnu/hello/hello-2.8.tar.gz",
          sha256 : "0wqd8sjmxfskrflaxywc7gqw7sfawrfvdxd9skxawzfgyy0pzdz6"
        }),
  
        doCheck : true,

        meta : {
          description : "A program that produces a familiar, friendly greeting",
          homepage : {
            _type : "url",
            value : "http://www.gnu.org/software/hello/manual"
          },
          license : "GPLv3+"
        }
      });
    };

A package build export the `pkg` property, which refers to a function definition
taking the build-time dependencies of the package as argument object. In the
body of the function, we return the result of an invocation to the
`mkDerivation()` function that builds a package from source code. To this
function we pass essential build parameters, such as the source code.

As with ordinary Nix expressions, we cannot use this CommonJS module to build a
package directly. We have to compose it by calling it with its required function
arguments. Composition is done in the composition module: `pkgs.js` in the
`tests/ folder`. The structure of this file is as follows:

    var pkgs = {

      stdenv : function() {
        return require('./pkgs/stdenv.js').pkg;
      },

      fetchurl : function(args) {
        return require('./pkgs/fetchurl.js').pkg(args);
      },

      hello : function() {
        return require('./pkgs/hello.js').pkg({
          stdenv : pkgs.stdenv,
          fetchurl : pkgs.fetchurl
        });
      },
  
      ...
    };

    exports.pkgs = pkgs;

The above module exports the `pkgs` property that refers to an object in which
each member refers to a function definition. These functions call the package
modules with its required parameters. By applying these functions, a Nix
expression get generated that can be built by the Nix package manager.

Building packages programmatically
----------------------------------
The `callNixBuild()` function can be used to build a generated Nix expression:

    var nijs = require('nijs');
    var pkgs = require('pkgs.js');

    nijs.callNixBuild({
      nixObject : pkgs.hello(),
      onSuccess : function(result) {
        process.stdout.write(result + "\n");
      },
      onFailure : function(code) {
        process.exit(code);
      }
    });

In the code fragment above we call the `callNixBuild` function, in which we
evaluate the hello package that gets build asynchronously by Nix. The
`onSuccess()` callback function is called when the build succeeds with the
resulting Nix store path as function parameter. The store path is printed on the
standard output. If the build fails, the `onFailure()` callback function is
called with the non-zero exit status code as parameter.

Building packages through a command-line utility
------------------------------------------------
As the previous code example is so common, there is also a command-line utility
that can do the same. The following instruction builds the hello package from the
composition module (`pkgs.js`):

    $ nijs-build pkgs.js -A hello

Calling JavaScript functions from Nix expressions
-------------------------------------------------
Another use case of NiJS is to call JavaScript functions from Nix expressions.
This can be done by using the `nijsFunProxy` Nix function. The following code
fragment shows a Nix expression using the `sum()` JavaScript function to add two
integers and writes the result to a text file in the Nix store:

    {stdenv}:

    let
      sum = a: b: import <nijs/funProxy.nix> {
        function = ''
          function sum(a, b) {
            return a + b;
          }
        '';
        args = [ a b ];
      };
    in
    stdenv.mkDerivation {
      name = "sum";
  
      buildCommand = ''
        echo ${toString (sum 1 2)} > $out
      '';
    }

As can be observed, the `nijsFunProxy` is a very thin layer that propagates the
Nix function parameters to the JavaScript function (Nix objects are conversed to
JavaScript object) and the resulting JavaScript object is translated back to a
Nix expression.

JavaScript function calls have a number of caveats that a developer should take
in mind:

* We cannot use variables outside the scope of the function, e.g. global variables.
* We must always return something. If nothing is returned, we will have an undefined object, which cannot be converted.
* Functions with a variable number of positional arguments are not supported, as Nix functions don't support this.

Examples
========
The `tests/` directory contains a number of interesting example cases:

* `pkgs.js` is a composition module containing a collection of NiJS packages
* `proxytests.nix` is a composition Nix expression containing a collection of JavaScript function invocations from Nix expressions

License
=======
The contents of this package is available under the [MIT license](http://opensource.org/licenses/MIT)
