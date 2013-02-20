{stdenv, nijsFunProxy}:

let
  timerTest = message: nijsFunProxy {
    function = ''
      function timerTest(message) {
        setTimeout(function() {
          nijsCallbacks.onSuccess(message);
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
