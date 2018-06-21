# pedantry

[![npm version](https://badge.fury.io/js/pedantry.svg)](https://npmjs.org/package/pedantry)

`pedantry` is a Node.js package that implements a readable stream which puts together of all files in the directory in the sorted order. It also supports reading `index.md` and `footer.md` as first and last files respectively if found.

```sh
yarn add -E pedantry
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`constructor(source: string): Pedantry`](#constructorsource-string-pedantry)

## API

The main export of the program is the `Pedantry` duplex stream which should only be used as a Readable.

```js
import Pedantry from 'pedantry'
```

### `constructor(`<br/>&nbsp;&nbsp;`source: string,`<br/>`): Pedantry`

Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order:

- the content of the `index.md` file will go first if it exists,
- then of all files and directories in the folder recursively in a sorted order,
- and the content of the `footer.md` file will go last if found.

Given the directory structure:

```fs
example/test
├── 1-words.md
├── 2-believe.md
├── 3-brick.md
├── footer.md
└── index.md
```

The usage of `Pedantry` is as below:

```javascript
import Catchment from 'catchment'
import Pedantry from 'pedantry'

(async () => {
  try {
    const pedantry = new Pedantry('example/test')
    const catchment = new Catchment()
    pedantry.pipe(catchment)
    const res = await catchment.promise
    console.log(res)
  } catch ({ stack }) {
    console.log('stack')
  }
})()
```

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
