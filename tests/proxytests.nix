{ pkgs ? import <nixpkgs> {}
, nijs ? builtins.getAttr (builtins.currentSystem) ((import ../release.nix {}).build)
}:

let
  nijsFunProxy = import ../lib/funProxy.nix {
    inherit (pkgs) stdenv nodejs;
    inherit nijs;
  };
  
  nijsInlineProxy = import ../lib/inlineProxy.nix {
    inherit (pkgs) stdenv writeTextFile nodejs;
    inherit nijs;
  };
in
rec {
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
  
  returnEscapedString = import ./proxytests/returnEscapedString.nix {
    inherit (pkgs) stdenv;
    inherit nijsFunProxy;
  };
  
  returnAttrSetStrings = import ./proxytests/returnAttrSetStrings.nix {
    inherit (pkgs) stdenv;
    inherit nijsFunProxy;
  };
  
  underscoreTest = import ./proxytests/underscoreTest.nix {
    inherit (pkgs) stdenv;
    inherit (pkgs.nodePackages) underscore;
    inherit nijsFunProxy;
  };
  
  timerTest = import ./proxytests/timerTest.nix {
    inherit (pkgs) stdenv;
    inherit nijsFunProxy;
  };
  
  createFileWithMessage = import ./proxytests/createFileWithMessage.nix {
    inherit (pkgs) stdenv;
    inherit nijsInlineProxy;
  };
  
  createFileWithUnderscore = import ./proxytests/createFileWithUnderscore.nix {
    inherit (pkgs) stdenv;
    inherit (pkgs.nodePackages) underscore;
    inherit nijsInlineProxy;
  };
  
  indirectionWget = import ./proxytests/indirectionWget.nix {
    inherit (pkgs) stdenv;
    inherit pkgs;
    inherit nijsFunProxy;
  };
}
