#!/bin/sh -e

# Set the TZ (timezone) environment variable, otherwise commands like
# `date' will complain (e.g., `Tue Mar 9 10:01:47 Local time zone must
# be set--see zic manual page 2004').
export TZ=UTC

addToSearchPath()
{
    local varName="$1"
    local value="$2"

    if [ -d "$value" ]
    then
        eval export $varName="$value${!varName:+:}${!varName}"
    fi
}

addToPATH()
{
    addToSearchPath PATH "$1/bin"
}

addToCPATH()
{
    addToSearchPath CPATH "$1/include"
}

addToLIBRARY_PATH()
{
    addToSearchPath LIBRARY_PATH "$1/lib"
    addToSearchPath LIBRARY_PATH "$1/lib32"
    addToSearchPath LIBRARY_PATH "$1/lib64"
}

envHooks=( "addToPATH" "addToCPATH" "addToLIBRARY_PATH" )

addToEnv()
{
    local pkg=$1

    for i in "${envHooks[@]}"
    do
        $i "$pkg"
    done
}

addEnvHooks()
{
    local hostOffset="$1" # Ignored in this builder, but for feature parity with Nixpkgs stdenv
    envHooks+=("$2")
}

importBuildInputs()
{
    local buildInputs="$@"

    # Modify environment variables (such as PATH) so that the build inputs can be found

    for i in $buildInputs
    do
        addToEnv $i
    done
}

addPropagatedBuildInputs()
{
    for i in $@
    do
        if [ -f $i/nix-support/propagated-build-inputs ]
        then
            local extraBuildInputs="$(cat $i/nix-support/propagated-build-inputs)"
            buildInputs="$buildInputs $extraBuildInputs"
            addPropagatedBuildInputs $extraBuildInputs
        fi
    done
}

sourceSetupHooks()
{
    for i in $@
    do
        if [ -f $i/nix-support/setup-hook ]
        then
            source $i/nix-support/setup-hook
        fi
    done
}

addPropagatedBuildInputs $buildInputs $propagatedBuildInputs
sourceSetupHooks $buildInputs $propagatedBuildInputs
importBuildInputs $buildInputs $propagatedBuildInputs

# If propagated build inputs are set, write them to nix-support/propagated-build-inputs

if [ -n "$propagatedBuildInputs" ]
then
    mkdir -p $out/nix-support
    echo "$propagatedBuildInputs" > $out/nix-support/propagated-build-inputs
fi


# Run a hook. A hook can be defined as function/alias/builtin, a file
# representing a script or process, or a string containing shell code

runHook()
{
    local hookName=$1
    local hookType=$(type -t $hookName)

    if [ -z "${!hookName}" ]
    then
        case "$hookType" in
            function|alias|builtin)
                $hookName
                ;;
            file)
                source $hookName
                ;;
            *)
                eval "${!hookName}"
                ;;
        esac
    else
        eval "${!hookName}"
    fi
}

# Execute a particular phase. Every phase has a pre and post hook,
# which can be configured by the user. Every phase can be disabled
# by setting the dont<phaseName> to true / 1.

executePhase()
{
    local phase=$1
    local dontVariableName=dont${phase^}

    if [ -z "${!dontVariableName}" ]
    then
        runHook pre${phase^}
        runHook ${phase}Phase
        runHook post${phase^}
    fi
}

# TODO something with buildinputs

unpackFile()
{
    local packedFile="$1"

    case "$packedFile" in
        *.tar|*.tar.gz|*.tar.bz2|*.tgz|*.tar.xz|*.tar.lzma)
            tar xfv "$packedFile"
            ;;
        *.zip)
            unzip "$packedFile"
            ;;
    esac
}

unpackPhase()
{
    # Unpack source files
    if [ ! -z "$src" ]
    then
        srcs=$src
    fi

    for i in $srcs
    do
        unpackFile $i
    done

    # Enter source directory
    if [ -z "$sourceRoot" ]
    then
        cd *
    else
        cd $sourceRoot
    fi
}

uncompressFile()
{
    local file="$1"

    for i in $uncompressHooks
    do
        case "$i" in
            *.gz)
                gzip -cd "$i"
                ;;
            *.bz2)
                bzip2 -cd "$i"
                ;;
            *.xz)
                xz -d < "$i"
                ;;
        esac
    done
}

patchPhase()
{
    for i in $patches
    do
        case "$i" in
            *.patch | *.diff)
                cat "$i" | patch $patchFlags
                ;;
            *)
                uncompressFile "$i" | patch $patchFlags
                ;;
        esac
    done
}

configurePhase()
{
    if [ -x $configureScript ]
    then
        eval $configureScript $prefix $configureFlags
    fi
}

buildPhase()
{
    if [ -f $makefile ]
    then
        eval make -f $makefile $makeFlags $buildFlags
    fi
}

installPhase()
{
    if [ -f $makefile ]
    then
        eval make -f $makefile $makeFlags $installFlags install
    fi
}

if [ -z "$buildCommand" ]
then
    # Set some default values

    if [ -z "$configureScript" ]
    then
        configureScript="./configure"
    fi

    if [ -z "$prefix" ]
    then
        prefix='--prefix=$out'
    fi

    if [ -z "$makefile" ]
    then
        makefile="Makefile"
    fi

    if [ -z "$phases" ]
    then
        phases="unpack patch configure build install"
    fi

    # Execute phases

    for phase in $phases
    do
        executePhase $phase
    done
else
    eval "$buildCommand"
fi
