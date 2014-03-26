source $stdenv/setup

unpackPhase() {
     true
}

configurePhase() {
    runHook preConfigure
    mkdir -p node_modules
    for i in $deps
    do
        for j in $i/lib/node_modules/*
        do
            if [ -d $j ]
            then
                ln -sf $j node_modules
            fi
        done
    done
    export HOME=$(pwd)
    runHook postConfigure
}

buildPhase() {
    runHook preBuild
    npm --registry http://www.example.com install $src
    runHook postBuild
}

installPhase() {
    runHook preInstall
    
    # Move the node_modules to the output folder
    mkdir -p $out/lib/node_modules
    mv node_modules/* $out/lib/node_modules
    
    # If we have executables move the .bin folder and create a symlink
    
    if [ -d node_modules/.bin ]
    then
        mv node_modules/.bin $out/lib/node_modules
        ln -sv $out/lib/node_modules/.bin $out/bin
    fi
    
    runHook postInstall
}

genericBuild
