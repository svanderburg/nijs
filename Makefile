duck:
	mkdir -p build
	tail -n +3 bin/nijs-build.js > build/nijs-build.js
	jsduck --config=doc/config.json --output=build `find . -name \*.js | grep -v -x ./bin/nijs-build.js`

doc: duck # DUH!!

clean:
	rm -rf build
