Experiments with WebAssembly.

# nbody

Can we easily run WebAssembly in the d8 shell (v8) and browser?
What is the relative performance with JavaScript?

### Building

Assumptions:
  - You've installed `emsdk` by following the [WebAssembly Developer's Guide](http://webassembly.org/getting-started/developers-guide/)
  - `emsdk` is installed at `/p/emsdk`

```zsh
source /p/emsdk/emsdk_env.sh
emcc nbody.c -O3 -s WASM=1 -s SIDE_MODULE=1 -o nbody.wasm
node to_js.js nbody.wasm > nbody.js
```

### Running

In d8...

```zsh
/p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks --wasm_no_stack_checks nbody.js
```

In a browser...

```zsh
open nbody.html
```

### Performance


#### WASM

```zsh
> time /p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks --wasm_no_stack_checks nbody.js
-0.16905990680272504
/p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks  nbody.js  6.59s user 0.02s system 99% cpu 6.614 total

> time /p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks --wasm_no_stack_checks nbody.js
-0.16905990680272504
/p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks  nbody.js  6.58s user 0.03s system 99% cpu 6.606 total

> time /p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks --wasm_no_stack_checks nbody.js
-0.16905990680272504
/p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks  nbody.js  6.57s user 0.03s system 99% cpu 6.597 total
```

#### JS

```zsh
> time /p/google/v8/out.gn/x64.release/d8 nbody-ref.js -- 50000000
-0.169075164
-0.169059907
/p/google/v8/out.gn/x64.release/d8 nbody-ref.js -- 50000000  6.87s user 0.02s system 99% cpu 6.898 total
> time /p/google/v8/out.gn/x64.release/d8 nbody-ref.js -- 50000000
-0.169075164
-0.169059907
/p/google/v8/out.gn/x64.release/d8 nbody-ref.js -- 50000000  6.90s user 0.03s system 99% cpu 6.926 total
> time /p/google/v8/out.gn/x64.release/d8 nbody-ref.js -- 50000000
-0.169075164
-0.169059907
/p/google/v8/out.gn/x64.release/d8 nbody-ref.js -- 50000000  6.87s user 0.02s system 99% cpu 6.897 total
```
