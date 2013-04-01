#!/bin/sh -e

for url in $mirrors
do
    if curl --location --max-redirs 20 --retry 3 --disable-epsv --cookie-jar cookies --insecure --fail "$url" --output "$out"
    then
        success=1
    fi
done

if [ "$success" != "1" ]
then
    exit 1
fi
