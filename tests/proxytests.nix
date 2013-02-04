{pkgs ? import <nixpkgs> {} }:

rec {
  nijsFunProxy = import ../lib/funProxy.nix {
    inherit (pkgs) stdenv nodejs;
  };
  
  sum = import ./proxytests/sum.nix {
    inherit (pkgs) stdenv;
    inherit nijsFunProxy;
  };
  
  appendTwoStrings = import ./proxytests/appendTwoStrings.nix {
    inherit (pkgs) stdenv;
    inherit nijsFunProxy;
  };
  
  printObjectAndReturnBye = import ./proxytests/printObjectAndReturnBye.nix {
    inherit (pkgs) stdenv;
    inherit nijsFunProxy;
  };
  
  underscoreTest = import ./proxytests/underscoreTest.nix {
    inherit (pkgs) stdenv;
    inherit (pkgs.nodePackages) underscore;
    inherit nijsFunProxy;
  };
}
