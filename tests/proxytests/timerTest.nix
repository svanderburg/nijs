{stdenv, nijsFunProxy}:

let
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
