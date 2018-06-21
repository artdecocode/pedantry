# pedantry

%NPM: pedantry%

`pedantry` is a Node.js package that implements a readable stream which puts together of all files in the directory in the sorted order. It also supports reading `index.md` and `footer.md` as first and last files respectively if found.

```sh
yarn add -E pedantry
```

## Table Of Contents

%TOC%

## API

The main export of the program is the `Pedantry` duplex stream which should only be used as a Readable.

```js
import Pedantry from 'pedantry'
```

```### constructor => Pedantry
[
  ["source", "string"]
]
```

<!-- Instances of the `Pedantry` class will start reading the directory and push data immediately. The data is a merged buffer of contents of all files. -->

Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order:

- the content of the `index.md` file will go first if it exists,
- then of all files and directories in the folder recursively in a sorted order,
- and the content of the `footer.md` file will go last if found.

Given the directory structure:

%TREE example/test%

The usage of `Pedantry` is as below:

%EXAMPLE: example/Pedantry.js, ../src => pedantry, javascript%

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
