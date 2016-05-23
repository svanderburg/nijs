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
* To use the `nijs-build` and `nijs-execute` command-line utilities, we require the [optparse](https://github.com/jfd/optparse-js) library to be installed either through Nix or NPM
* The [slasp](https://github.com/svanderburg/slasp) library is required to make asynchronous programming more convenient.
* Of course, since this package provides a feature for Nix, we require the [Nix package manager](http://nixos.org/nix) to be installed

Installation
============
There are two ways this package can installed.

To install this package through the Nix package manager, obtain a copy of [Nixpkgs](http://nixos.org/nixpkgs)
and run:

    $ nix-env -f '<nixpkgs>' -iA nodePackages.nijs

Alternatively, this package can also be installed through NPM by running:

    $ npm install -g nijs

Usage
=====
This package offers a number of interesting features.

Calling a Nix function from JavaScript
--------------------------------------
The most important use case of this package is to be able to call Nix functions
from JavaScript. To call a Nix function, we must create a simple proxy that
translates a JavaScript function call to a string containing a semantically
equivalent Nix function invocation.

The following code fragment demonstrates a JavaScript function proxy that
relays a call to the `stdenv.mkDerivation {}` function in Nix:

```javascript
var nijs = require('nijs');

function mkDerivation(args) {
  return new nijs.NixFunInvocation({
    funExpr: new nijs.NixExpression("pkgs.stdenv.mkDerivation"),
    paramExpr: args
  });
}
```

As can be observed, the function proxy has a very simple structure. It takes an
arbitrary JavaScript object as a parameter and returns a JavaScript object
representing a Nix function invocation to `stdenv.mkDerivation {}` using the
`args` object as an argument.

The conversion to Nix is done automatically by NiJS through a function called
`jsToNix()`.

Compiling JavaScript language constructs into Nix language constructs
---------------------------------------------------------------------
The `jsToNix()` function is used by NiJS to transform JavaScript language
constructs to Nix expression language constructs.

JavaScript objects are translated into semantically equivalent (or similar) Nix
expression language objects as follows:

* `null` references are translated into `null` values
* Objects of type `boolean` and `number` are translated verbatim
* Objects of type `string` and `xml` are translated verbatim and are automatically escaped
* `Array`s of objects are recursively translated into lists of objects.
* "Ordinary" objects are recursively translated into attribute sets. Keys are translated into identifiers unless they contain characters not allowing it do to so. If the latter is the case, they are translated into strings.
* A JavaScript `Function` is wrapped into a function proxy so that it can be invoked from a Nix expression (see section: 'Calling JavaScript functions from Nix expressions')
* Object members whose values are `undefined` are not included in the generated attribute set. In all other cases `undefined` translates to `null`.

Some Nix expression language constructs have no semantic equivalent in
JavaScript. Nonetheless, they can be generated by composing an abstract syntax
tree of objects that are instances of prototypes that inherit from `NixObject`:

* An object instance of `NixFile` can be used to specify a relative or absolute path to a file. Nix checks whether the file exists and imports it into the Nix store.
* To encode URLs, an object instance of `NixURL` can be used.
* Recursive attribute sets (in which attributes are allowed to refer to each other) can be defined by creating an object instance of the `NixRecursiveAttrSet` prototype.
* Referring to an attribute of an attribute set can be done by creating an object instance of `NixAttrReference`
* Defining functions in the Nix expression language instead of JavaScript can be done by instantiating `NixFunction`.
* A Nix function can be invoked by creating an object that is an instance of the `NixFunInvocation` prototype.
* An external Nix expression file can be imported by creating a `NixImport` object that refers to an external file.
* Referring to existing Nix store paths can be done by creating objects that are instances of `NixStorePath`.
* An if-then-else block can be generated by defining an `NixIf` object.
* An assert block can be defined with an `NixAssert` object.
* A let-block containing private values can be defined by means of a `NixLet` object.
* A value can be imported into the lexical scope of a block by assigning a member of an object, `NixLet`, or `NixRecursiveAttrSet` to an object instance of `NixInherit`.
* Attributes member of an attribute set can be imported into the lexical scope by creating a `NixWith` object.
* Two attribute sets can be merged by creating a `NixMergeAttrs` object.
* Defining build instructions in JavaScript (as opposed to bash code embedded in strings) can be done by creating a `NixInlineJS` object (see section: 'Writing inline JavaScript code in a NiJS package specification').
* To literally do stuff in the Nix expression language, compose objects that are instances of the `NixExpression` prototype.

Check the API documentation for more details on how to use the above prototypes.
More details on the Nix expression language can be found in the Nix manual.

Specifying packages in JavaScript
---------------------------------
The `stdenv.mkDerivation()` function shown earlier is a very important function
in Nix. It's directly and indirectly used by nearly every package recipe to
perform a build from source code. In the `tests/` folder, we have defined a
packages repository: `pkgs.js` that provides a proxy to this function.

By using this proxy we can also describe our own package specifications in
JavaScript, instead of the Nix expression language. Every package build recipe
can be written as a CommonJS module, that may look as follows:

```javascript
var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "hello-2.8",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/hello/hello-2.8.tar.gz"),
      sha256 : "0wqd8sjmxfskrflaxywc7gqw7sfawrfvdxd9skxawzfgyy0pzdz6"
    }),
  
    doCheck : true,

    meta : {
      description : "A program that produces a familiar, friendly greeting",
      homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
      license : "GPLv3+"
    }
  });
};
```

A package module exports the `pkg` property, which refers to a function
definition taking the build-time dependencies of the package as argument object.
In the body of the function, we return the result of an invocation to the
`mkDerivation()` function that builds a package from source code. To this
function we pass essential build parameters, such as the URL from which the
source code can be obtained.

Nix has special types for URLs and files to check whether they are in the valid
format and that they are automatically imported into the Nix store for purity.
As they are not in the JavaScript language, we can artificially create them
through objects that are instances of the `NixFile` and `NixURL` prototypes.

Moreover, there are more prototypes for some other Nix expression language
constructs that have no JavaScript equivalent. Check the API documentation for
more information.

Composing packages
------------------
As with ordinary Nix expressions, we cannot use this CommonJS module to build a
package directly. We have to *compose* it by calling it with its required
function arguments. Composition is done in the composition module: `pkgs.js` in
the `tests/` folder. The structure of this file is as follows:

```javascript
var pkgs = {

  stdenv : function() {
    return require('./pkgs/stdenv.js').pkg;
  },

  fetchurl : function() {
    return require('./pkgs/fetchurl/fetchurl.js').pkg({
      stdenv : pkgs.stdenv
    });
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
```

The above module exports the `pkgs` property that refers to an object in which
each member refers to a function definition. These functions call the package
modules with its required parameters. By evaluating these functions, a Nix
expression gets generated that can be built by the Nix package manager.

Building packages programmatically
----------------------------------
The `callNixBuild()` function can be used to build a generated Nix expression:

```javascript
var nijs = require('nijs');
var pkgs = require('pkgs.js').pkgs;

nijs.callNixBuild({
  nixExpression : pkgs.hello(),
  params : [],
  pkgsExpression : "import <nixpkgs> {}", /* Optional parameter, which defaults to this value */
  callback : function(err, result) {
    if(err) {
      process.stderr.write(err);
      process.exit(1);
    } else {
      process.stdout.write(result + "\n");
    }
  }
});
```

In the code fragment above we call the `callNixBuild` function, in which we
evaluate the hello package that gets built asynchronously by Nix. The
`callback` function parameter is called when the build has been done, providing
either an `err` parameter that is not null if some error occured or `result`
referring to the resulting Nix store path. Finally, the store path is printed on
the standard output.

Building packages through a command-line utility
------------------------------------------------
As the previous code example is so common, there is also a command-line utility
that can do the same. The following instruction builds the hello package from the
composition module (`pkgs.js`):

    $ nijs-build pkgs.js -A hello

It may also be useful to see what kind of Nix expression is generated for
debugging or testing purposes. The `--eval-only` option prints the generated
Nix expression on the standard output:

    $ nijs-build pkgs.js -A hello --eval-only

We can also nicely format the generated expression to improve readability:

    $ nijs-build pkgs.js -A hello --eval-only --format

Building NiJS packages from a Nix expression
--------------------------------------------
We can also call the composition CommonJS module from a Nix expression. This is
useful to build NiJS packages from [Hydra](http://nixos.org/hydra), a continuous
build and integration server built around Nix.

The following Nix expression builds the hello package defined in `pkgs.js` shown
earlier:

```nix
{nixpkgs, system, nijs}:

let
  nijsImportPackage = import "${nijs}/lib/node_modules/nijs/lib/importPackage.nix" {
    inherit nixpkgs system nijs;
  };
in
{
  hello = nijsImportPackage { pkgsJsFile = ./tests/pkgs/pkgs.js; attrName = "hello"; };
  ...
}
```

Calling JavaScript functions from Nix expressions
-------------------------------------------------
Another use case of NiJS is to call JavaScript functions from Nix expressions.
This can be done by using the `nijsFunProxy` Nix function. The following code
fragment shows a Nix expression using the `sum()` JavaScript function to add two
integers and writes the result to a text file in the Nix store:

```nix
{stdenv, nodejs, nijs}:

let
  nijsFunProxy = import "${nijs}/lib/node_modules/nijs/lib/funProxy.nix" {
    inherit stdenv nodejs nijs;
  };

  sum = a: b: nijsFunProxy {
    name = "sum"; # Optional, but allows one to read function names in the traces if an error occurs
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
```

As can be observed, the `nijsFunProxy` is a very thin layer that propagates the
Nix function parameters to the JavaScript function (Nix objects are converted to
JavaScript object) and the resulting JavaScript object is translated back to a
Nix expression.

JavaScript function calls have a number of caveats that a developer should take
in mind:

* We cannot use variables outside the scope of the function, e.g. global variables.
* We must always return something. If nothing is returned, we will have an undefined object, which cannot be converted.
* Functions with a variable number of positional arguments are not supported, as Nix functions don't support this.

Using CommonJS modules in embedded JavaScript functions
-------------------------------------------------------
It may be very annoying to only use self contained JavaScript code fragments, as
we cannot access anything outside the function's scope. Fortunately, the
`nijsFunProxy` can also take Node packages through Nix as parameters and make
them available to that function. The following code fragment uses the [Underscore](http://underscorejs.org)
library to convert a list of integers to a list of strings:

```nix
{stdenv, nodejs, nijs, underscore}:

let
  nijsFunProxy = import "${nijs}/lib/node_modules/nijs/lib/funProxy.nix" {
    inherit stdenv nodejs nijs;
  };
  
  underscoreTestFun = numbers: nijsFunProxy {
    name = "underscoreTestFun";
    function = ''
      function underscoreTestFun(numbers) {
        var words = [ "one", "two", "three", "four", "five" ];
        var result = [];
      
        _.each(numbers, function(elem) {
          result.push(words[elem - 1]);
        });
    
        return result;
      }
    '';
    args = [ numbers ];
    modules = [ underscore ];
    requires = [
      { var = "_"; module = "underscore"; }
    ];
  };
in
stdenv.mkDerivation {
  name = "underscoreTest";
 
  buildCommand = ''
    echo ${toString (underscoreTestFun [ 5 4 3 2 1 ])} > $out
  '';
}
```

The `modules` parameter is a list of Node.JS packages (provided through Nixpkgs)
and the `require` parameter is a list taking var and module pairs. The latter
parameter is used to automatically generate a collection of require statements.
In this case, it adds the following line before the function definition:

```javascript
var _ = require('underscore');
```

Calling asynchronous JavaScript functions from Nix expressions
--------------------------------------------------------------
In Node.js, most of the standard utility functions are *asynchronous*, which
will return immediately, and invoke a callback function when the task is done.
To allow these functions to be used inside a Nix expression, we must set the
`async` parameter to `true` in the `nijsFunProxy`. Furthermore, instead of
returning an object or throwing an exception, we must call the
`nijsCallbacks.callback(err, result)` function.

The following example uses a timer that calls the success callback function
after three seconds, with a standard greeting message:

```nix
{stdenv, nodejs, nijs}:

let
  nijsFunProxy = import "${nijs}/lib/node_modules/nijs/lib/funProxy.nix" {
    inherit stdenv nodejs nijs;
  };
  
  timerTest = message: nijsFunProxy {
    name = "timerTest";
    function = ''
      function timerTest(message) {
        setTimeout(function() {
          nijsCallbacks.callback(null, message);
        }, 3000);
      }
    '';
    args = [ message ];
    async = true;
  };
in
stdenv.mkDerivation {
  name = "timerTest";
 
  buildCommand = ''
    echo ${timerTest "Hello world! The timer test works!"} > $out
  '';
}
```

Writing inline JavaScript code in Nix expressions
-------------------------------------------------
All the examples so far use generic building procedures or refer to JavaScript
functions that expose themselves as Nix functions. Sometimes it may also be
required to implement a custom build procedure for a package. Nix uses the Bash
shell as its default builder, hence it requires developers to implement custom
build steps as shell code embedded in strings.

It may also be desired to implement custom build procedure steps as embedded
JavaScript code, instead of embedded shell code. The `nijsInlineProxy` function
allows a developer to write inline JavaScript code inside a Nix expression:

```nix
{stdenv, writeTextFile, nodejs, nijs}:

let
  nijsInlineProxy = import "${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix" {
    inherit stdenv writeTextFile nodejs nijs;
  };
in
stdenv.mkDerivation {
  name = "createFileWithMessage";
  buildCommand = nijsInlineProxy {
    name = "createFileWithMessage-buildCommand"; # Optional, but allows one to read function names in the traces if an error occurs
    requires = [
      { var = "fs"; module = "fs"; }
      { var = "path"; module = "path"; }
    ];
    code = ''
      fs.mkdirSync(process.env['out']);
      var message = "Hello world written through inline JavaScript!";
      fs.writeFileSync(path.join(process.env['out'], "message.txt"), message);
    '';
  };
}
```

The above example Nix expression implements a custom build procedure that
creates a Nix component containing a file named `message.txt` with a standard
greeting message. As you may see, instead of providing a custom `buildCommand`
that contains shell code we invoke the `nijsInlineProxy` that uses two CommonJS
modules. The code implements our custom build procedure in JavaScript.

As with ordinary Nix expressions, the parameters passed to `stdenv.mkDerivation`
and its generic properties are accessible as environment variables inside the
builder. In our example, `process.env['out']` is an environment variable
containing the Nix store output path of our package.

The `nijsInlineProxy` has the same limitations as the `nijsFunProxy`, such as the
fact that global variables cannot be accessed. Moreover, like the `nijsFunProxy`
it can also take the `modules` parameter allowing one to utilise external node.js
packages.

Writing inline JavaScript code in a NiJS package specification
--------------------------------------------------------------
When implementing a custom build procedure in a NiJS package module, we may also
run into the same inconvenience of having to embed custom build steps as shell
code embedded in strings. We can also use the `nijsInlineProxy` from a NiJS
package module, by creating an object that is an instance of the `NixInlineJS`
prototype:

```javascript
var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "createFileWithMessageTest",
    buildCommand : new nijs.NixInlineJS({
      requires : [
        { "var" : "fs", "module" : "fs" },
        { "var" : "path", "module" : "path" }
      ],
      code : function() {
        fs.mkdirSync(process.env['out']);
        var message = "Hello world written through inline JavaScript!";
        fs.writeFileSync(path.join(process.env['out'], "message.txt"), message);
      }
    })
  });
};
```

The above NiJS package module shows the NiJS equivalent of our first Nix
expression example containing inline JavaScript code.

The `buildCommand` parameter is bound to an instance of the `NixInlineJS`
prototype. The `code` parameter can be either a JavaScript function (that takes
no parameters) or a string that contains embedded JavaScript code. The
former case (the function approach) has the advantage that its syntax can be
checked or visualised by an editor, interpreter or compiler.

Specifying packages asynchronously
----------------------------------
Earlier, we have shown that we can describe package specifications in JavaScript.
The example shown previously (specifying GNU Hello) is a *synchronous* package
specification. We can also specify packages asynchronously, for example:

```javascript
var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("mirror://gnu/hello/hello-2.8.tar.gz"),
        sha256 : "0wqd8sjmxfskrflaxywc7gqw7sfawrfvdxd9skxawzfgyy0pzdz6"
      }, callback);
    },

    function(callback, src) {
      args.stdenv().mkDerivation ({
        name : "hello-2.8",
        src : src,
 
        doCheck : true,
        meta : {
          description : "A program that produces a familiar, friendly greeting",
          homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
          license : "GPLv3+"
        }
      }, callback);
    }
  ], callback);
};
```

The above expression has the same meaning as the synchronous GNU Hello
expression, but implements an interface using callbacks. Moreover, it uses the
`slasp` library to flatten the code structure to make it better readable and
maintainable.

Composing packages asynchronously
---------------------------------
Asynchronous packages also have to be composed by passing the required
dependencies of a package as function parameters:

```javascript
var pkgs = {

  stdenv : function(callback) {
    return require('./pkgs-async/stdenv.js').pkg;
  },
  
  fetchurl : function(callback) {
    return require('./pkgs-async/fetchurl').pkg({
      stdenv : pkgs.stdenv
    }, callback);
  },
  
  hello : function(callback) {
    return require('./pkgs-async/hello.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl
    }, callback);
  },

  ...
};

exports.pkgs = pkgs;
```

The above composition module has the same meaning as the synchronous composition
module shown earlier. The minor difference is that all functions provide a
callback interface.

Building asynchronous packages through a command-line utility
-------------------------------------------------------------
The NiJS build tool can also compile asynchronous packages to Nix expressions and
build them with Nix.

To allow the asynchronous modules to be recognized we need to pass the `--async`
parameter to `nijs-build`:

    $ nijs-build pkgs-async.js -A hello --async

Executing asynchronous package specifications directly
------------------------------------------------------
Another use case of asynchronous packages (which cannot be done with synchronous
package specifications) is that they can be built directly, without using the Nix
package manager.

The following command uses NiJS to build the same package:

    $ nijs-execute pkgs-async.js -A hello

Packages are stored in a so-called NiJS store. By default, this folder resides in
`$HOME/.nijs/store` but NiJS can be configured to store it elsewhere.

Although NiJS is capable of building packages, its features and facilities are
quite primitive. It should only be used for simple (test) use cases or as a toy.

Building asynchronous NiJS packages from a Nix expression
---------------------------------------------------------
As with synchronous package specifications, we can also call asynchronous
composition modules from Nix expressions.

To do this the `nijsImportPackageAsync {}` function should be used:

```nix
{nixpkgs, system, nijs}:

let
  nijsImportPackageAsync = import "${nijs}/lib/node_modules/nijs/lib/importPackageAsync.nix" {
    inherit nixpkgs system nijs;
  };
in
{
  hello = nijsImportPackageAsync { pkgsJsFile = ./tests/pkgs/pkgs-async.js; attrName = "hello"; };
  ...
}
```

Examples
========
The `tests/` directory contains a number of interesting example cases:

* `pkgs.js` is a composition module containing a collection of NiJS packages
* `proxytests.nix` is a composition Nix expression containing a collection of JavaScript function invocations from Nix expressions
* `pkgs-async.js` is a composition module containing a collection of NiJS packages that are specified asynchronously

API documentation
=================
This package includes API documentation, which can be generated with
[JSDuck](https://github.com/senchalabs/jsduck). The Makefile in this package
contains a `duck` target to generate it and produces the HTML files in `build/`:

    $ make duck

License
=======
The contents of this package is available under the [MIT license](http://opensource.org/licenses/MIT)
