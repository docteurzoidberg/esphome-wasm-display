em++ -std=c++11 -O2 testfireeffect.cpp -o testfireeffect.js -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -s EXPORTED_FUNCTIONS='["_malloc","_free"]'
cp ./testfireeffect.js ../webapp/public/
cp ./testfireeffect.wasm ../webapp/public/