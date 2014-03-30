var pkgs = {

  stdenv : function(callback) {
    return require('./pkgs-async/stdenv.js').pkg;
  },
  
  test : function(callback) {
    return require('./pkgs-async/test.js').pkg({
      stdenv : pkgs.stdenv
    }, callback);
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
  
  zlib : function(callback) {
    return require('./pkgs-async/zlib.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl
    }, callback);
  },
  
  file : function(callback) {
    return require('./pkgs-async/file.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      zlib : pkgs.zlib
    }, callback);
  },
  
  createFileWithMessageTest : function(callback) {
    return require('./pkgs-async/createFileWithMessageTest.js').pkg({
      stdenv : pkgs.stdenv
    }, callback);
  }
};

exports.pkgs = pkgs;
