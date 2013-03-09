{pkgs ? import <nixpkgs> {} }:

let
  nijsFunProxy = import ../lib/funProxy.nix {
    inherit (pkgs) stdenv nodejs;
  };
  
  nijsInlineProxy = import ../lib/inlineProxy.nix {
    inherit (pkgs) stdenv writeTextFile nodejs;
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
}
