# pedantry

[![npm version](https://badge.fury.io/js/pedantry.svg)](https://npmjs.org/package/pedantry)

`pedantry` is a Node.js package that implements a readable stream which puts together of all files in the directory in the sorted order. It also supports reading `index.md` and `footer.md` as first and last files respectively if found.

```sh
yarn add -E pedantry
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`constructor(source: string, options?: Options): Pedantry`](#constructorsource-stringoptions-options-pedantry)
    * [`Options`](#options)
- [TODO](#todo)
- [Copyright](#copyright)

## API

The main export of the program is the `Pedantry` duplex stream which should only be used as a Readable.

```js
import Pedantry from 'pedantry'
```

### `constructor(`<br/>&nbsp;&nbsp;`source: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Pedantry`

Create a new readable stream. Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order:

1. the content of the `index.md` file will go first if it exists,
1. then of all files and directories in the folder recursively in a sorted order (possibly in reverse),
1. and the content of the `footer.md` file will go last if found.

__<a name="options">`Options`</a>__: Options for Pedantry.

|  Name   |   Type    |                                   Description                                   | Default |
| ------- | --------- | ------------------------------------------------------------------------------- | ------- |
| reverse | _boolean_ | Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. | `false` |

Given the directory structure:

```m
example/test
├── 1-words.md
├── 2-believe.md
├── 3-brick.md
├── footer.md
└── index.md
```

The usage of `Pedantry` is as below:

```js
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

## TODO

- [ ] Add todo list.

## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz
