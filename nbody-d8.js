'use strict';

const buf = readbuffer('nbody.wasm');
print(
  WebAssembly.Instance(
    new WebAssembly.Module(buf),
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
