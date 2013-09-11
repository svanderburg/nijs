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
  
  zlib : function() {
    return require('./pkgs/zlib.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl
    });
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
  
  openssl : function() {
    return require('./pkgs/openssl.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      perl : pkgs.perl,
      zlib : pkgs.zlib
    });
  },
  
  curl : function() {
    return require('./pkgs/curl.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      openssl : pkgs.openssl,
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
  },
  
  appendFilesTest : function() {
    return require('./pkgs/appendFilesTest.js').pkg({
      stdenv : pkgs.stdenv
    });
  },
  
  createFileWithMessageTest : function() {
    return require('./pkgs/createFileWithMessageTest.js').pkg({
      stdenv : pkgs.stdenv
    });
  },
  
  sayHello : function() {
    return require('./pkgs/sayHello.js').pkg({
      stdenv : pkgs.stdenv
    });
  },
  
  addressPerson : function() {
    return require('./pkgs/addressPerson.js').pkg({
      stdenv : pkgs.stdenv
    });
  },
  
  addressPersons: function() {
    return require('./pkgs/addressPersons.js').pkg({
      stdenv : pkgs.stdenv
    });
  },
  
  numbers: function() {
    return require('./pkgs/numbers.js').pkg({
      stdenv : pkgs.stdenv
    });
  }
};

exports.pkgs = pkgs;
