#!/bin/sh -e

if [ "$(type -P curl)" = "" ] # Dirty way to lookup curl, but the derivation has a fixed output, so it's fine
then
    curl="/run/current-system/sw/bin/curl"
else
    curl="$(type -P curl)"
fi

for url in $mirrors
do
    if $curl --location --max-redirs 20 --retry 3 --disable-epsv --cookie-jar cookies --insecure --fail "$url" --output "$out"
    then
        success=1
        break
    fi
done

if [ "$success" != "1" ]
then
    exit 1
fi
