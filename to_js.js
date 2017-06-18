/*

Reads a binary WASM file and outputs JavaScript to load and run an
assumed WASM exported `run` method.

*/
'use strict';

const fs = require('fs');
const file = process.argv[2];
const buf = fs.readFileSync(`${file}`, {encoding: 'binary'});
const result = [];
for(let i = 0; i < buf.length; ++i){
  result[i] = buf.charCodeAt(i);
}

console.log(
`'use strict';

console.log(
  WebAssembly.Instance(
    new WebAssembly.Module(new Uint8Array(${JSON.stringify(result)}).buffer),
    {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
      }
    }
  ).exports._run(50000000)
);
`
);

