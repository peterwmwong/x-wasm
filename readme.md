Experiments with WebAssembly.

# nbody

- Can we easily run WebAssembly in the d8 shell (v8) and browser?
- How does it perform against JS, C, and Ruby?

### Building

Assumptions:
  - You've installed `emsdk` by following the [WebAssembly Developer's Guide](http://webassembly.org/getting-started/developers-guide/)
  - `emsdk` is installed at `/p/emsdk`

```sh
> source /p/emsdk/emsdk_env.sh
> emcc nbody.c -O3 -s WASM=1 -s SIDE_MODULE=1 -o nbody.wasm
> node to_js.js nbody.wasm > nbody.js
```

Building the C reference implementation...

```sh
> gcc -O3 nbody.c -o nbody-gcc.run
```

### Running

In d8...

```sh
> /p/google/v8/out.gn/x64.release/d8 --wasm_no_bounds_checks --wasm_no_stack_checks nbody.js
```

In a browser...

```sh
> open nbody.html
```

### Performance


#### WASM

```sh
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

```sh
> time /p/google/v8/out.gn/x64.release/d8 nbody-ref.js
-0.169075164
-0.169059907
/p/google/v8/out.gn/x64.release/d8 nbody-ref.js  6.87s user 0.02s system 99% cpu 6.898 total
> time /p/google/v8/out.gn/x64.release/d8 nbody-ref.js
-0.169075164
-0.169059907
/p/google/v8/out.gn/x64.release/d8 nbody-ref.js  6.90s user 0.03s system 99% cpu 6.926 total
> time /p/google/v8/out.gn/x64.release/d8 nbody-ref.js
-0.169075164
-0.169059907
/p/google/v8/out.gn/x64.release/d8 nbody-ref.js  6.87s user 0.02s system 99% cpu 6.897 total
```

#### C

```sh
> time ./nbody-gcc.run
-0.16905990680272504
./nbody-gcc.run  4.92s user 0.00s system 99% cpu 4.926 total

> time ./nbody-gcc.run
-0.16905990680272504
./nbody-gcc.run  4.86s user 0.00s system 99% cpu 4.867 total

> time ./nbody-gcc.run
-0.16905990680272504
./nbody-gcc.run  4.90s user 0.00s system 99% cpu 4.904 total
```

#### Ruby

```sh
> ruby --version
ruby 2.4.1p111 (2017-03-22 revision 58053) [x86_64-darwin16]

> time ruby nbody.rb
```

![zzzzzz](https://media.giphy.com/media/26FxCOdhlvEQXbeH6/giphy.gif)

```sh
-0.16905990680291394
ruby nbody.rb  376.97s user 0.11s system 99% cpu 6:17.26 total
```
