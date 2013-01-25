exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "wget-1.13.4",
    
    src : args.fetchurl({
      url : "mirror://gnu/wget/wget-1.13.4.tar.gz",
      sha256 : "1kadjg63x1mm741dxdidwsn1rz0f7dkzbq59v0iww87jr45p3ir4"
    }),
    
    configureFlags : "--with-ssl=openssl",
    
    buildInputs : [ args.openssl() ],
    
    meta : {
      description : "GNU Wget, a tool for retrieving files using HTTP, HTTPS, and FTP",
      license : "GPLv3+",
      homepage : { _type : "url", value : "http://www.gnu.org/software/wget" }
    }
  });
};
