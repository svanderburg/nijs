{stdenv, nijsFunProxy}:

let
  printObjectAndReturnBye = args: nijsFunProxy {
    name = "printObjectAndReturnBye";
    function = ''
      function printObjectAndReturnBye(args) {
        for(var attrName in args) {
          var attrValue = args[attrName];
          process.stderr.write(attrName + " = " + attrValue + "\n");
        }
        
        return args.attrset.b;
      }
    '';
    args = [ args ];
  };
in
stdenv.mkDerivation {
  name = "printObjectAndReturnBye";
  
  buildCommand = ''
    echo ${printObjectAndReturnBye {
      str = "Hello world";
      number = 12345;
      list = [ 1 2 "abc" ];
      attrset = {
        a = 1;
        b = "Bye world";
      };
    } } > $out
  '';
}
