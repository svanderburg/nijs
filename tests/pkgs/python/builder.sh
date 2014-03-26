#!/bin/sh -e

source $stdenv/setup

for i in $inputs
do
    export C_INCLUDE_PATH=$i/include${C_INCLUDE_PATH:+:}$C_INCLUDE_PATH
    export LIBRARY_PATH=$i/lib${LIBRARY_PATH:+:}$LIBRARY_PATH
done

genericBuild
