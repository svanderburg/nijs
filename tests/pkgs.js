var pkgs = {

  stdenv : function() {
    return require('./pkgs/stdenv.js').pkg;
  },

  fetchurl : function() {
    return require('./pkgs/fetchurl').pkg({
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

  addressPersons : function() {
    return require('./pkgs/addressPersons.js').pkg({
      stdenv : pkgs.stdenv
    });
  },

  addressPersonInformally : function() {
    return require('./pkgs/addressPersonInformally.js').pkg({
      stdenv : pkgs.stdenv
    });
  },

  numbers : function() {
    return require('./pkgs/numbers.js').pkg({
      stdenv : pkgs.stdenv
    });
  },

  sayHello2 : function() {
    return require('./pkgs/sayHello2.js').pkg({
      stdenv : pkgs.stdenv
    });
  },

  objToXML : function() {
    return require('./pkgs/objToXML.js').pkg({
      writeTextFile : pkgs.writeTextFile
    });
  },

  conditionals: function() {
    return require('./pkgs/conditionals.js').pkg({
      writeTextFile : pkgs.writeTextFile
    });
  },

  bzip2 : function() {
    return require('./pkgs/bzip2.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl
    });
  },

  utillinux : function() {
    return require('./pkgs/utillinux.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      zlib : pkgs.zlib
    });
  },

  python : function() {
    return require('./pkgs/python').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      zlib : pkgs.zlib,
      bzip2 : pkgs.bzip2,
      openssl : pkgs.openssl,
    });
  },

  nodejs : function() {
    return require('./pkgs/nodejs').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl,
      python : pkgs.python,
      zlib : pkgs.zlib,
      openssl : pkgs.openssl,
      utillinux : pkgs.utillinux
    });
  },

  buildNodePackage : function() {
    return require('./pkgs/nodejs/buildNodePackage.js').pkg({
      stdenv : pkgs.stdenv,
      nodejs : pkgs.nodejs
    });
  },

  optparse : function() {
    return require('./pkgs/optparse.js').pkg({
      buildNodePackage : pkgs.buildNodePackage,
      fetchurl : pkgs.fetchurl
    });
  },

  slasp : function() {
    return require('./pkgs/slasp.js').pkg({
      buildNodePackage : pkgs.buildNodePackage,
      fetchurl : pkgs.fetchurl
    });
  },

  nijs : function() {
    return require('./pkgs/nijs.js').pkg({
      buildNodePackage : pkgs.buildNodePackage,
      fetchurl : pkgs.fetchurl,
      optparse : pkgs.optparse,
      slasp : pkgs.slasp
    });
  },

  underscoreTest : function() {
    return require('./pkgs/underscoreTest.js').pkg;
  },

  HelloModel : function() {
    return require('./pkgs/HelloModel.js').pkg({
      stdenv : pkgs.stdenv,
      fetchurl : pkgs.fetchurl
    });
  }
};

exports.pkgs = pkgs;
