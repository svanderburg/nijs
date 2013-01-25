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
  
  zlib : function() {
    return require('./pkgs/zlib.js').pkg;
  },
  
  file : function() {
    return require('./pkgs/file.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      zlib : pkgs.zlib
    });
  },
  
  perl : function() {
    return require('./pkgs/perl.js').pkg;
  },
  
  openssl : function () {
    return require('./pkgs/openssl.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      perl : pkgs.perl,
      zlib : pkgs.zlib
    });
  },
  
  wget : function() {
    return require('./pkgs/wget.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      openssl : pkgs.openssl
    });
  },

  sumTest : function() {
    return require('./pkgs/sumTest.js').pkg({
      stdenv : pkgs.stdenv
    })
  },
  
  writeTextFile : function(args) {
    return require('./pkgs/writeTextFile.js').pkg(args);
  },
  
  stringWriteTest : function () {
    return require('./pkgs/stringWriteTest.js').pkg({
      writeTextFile : pkgs.writeTextFile
    });
  }
};

exports.pkgs = pkgs;
