{stdenv, pkgs, nijsFunProxy}:

let
  indirectionWgetFun = nijsFunProxy {
    function = ''
      function indirectionWget() {
        return new nijs.NixExpression("{pkgs}: pkgs.wget");
      }
    '';
    args = [];
  };
  
  indirectionWget = indirectionWgetFun { inherit pkgs; };
in
stdenv.mkDerivation {
  name = "indirectionWget";
  
  buildCommand = ''
    mkdir -p $out/bin
    ln -s ${indirectionWget}/bin/wget $out/bin/wget
  '';
}
