# pedantry

[![npm version](https://badge.fury.io/js/pedantry.svg)](https://npmjs.org/package/pedantry)

_Pedantry_ is a readable stream that puts together all files and nested directories in the given directory in sorted order (`1.md`, `2.md`, `3/1.md`, `3/1.5.md`, `10.md`, _etc_). It will also read `index.md` and `footer.md` as first and last files respectively if found.

```sh
yarn add -E pedantry
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class `Pedantry`](#class-pedantry)
  * [`constructor(source: string, options?: Options): Pedantry`](#constructorsource-stringoptions-options-pedantry)
    * [`Options`](#type-options)
  * [Reverse Order](#reverse-order)
  * [Events](#events)
  * [Object Mode](#object-mode)
- [Copyright](#copyright)


## API

The main export of the program is the `Pedantry` duplex stream which should only be used as a Readable.

```js
import Pedantry from 'pedantry'
```


## class `Pedantry`

A _Pedantry_ instance reads files in order one-by-one and pushes the results further down the pipe.

### `constructor(`<br/>&nbsp;&nbsp;`source: string,`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): Pedantry`

Create a new readable stream. Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order:

1. the content of the `index.md` file will go first if it exists,
1. then of all files and directories in the folder recursively in a sorted order (possibly in reverse),
1. and the content of the `footer.md` file will go last if found.

__<a name="type-options">`Options`</a>__: Options for Pedantry.

|      Name       |   Type    |                                                                                            Description                                                                                            | Default |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| reverse         | _boolean_ | Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`.                                                                                                                   | `false` |
| addNewLine      | _boolean_ | Add a `\n` symbol between the content of each file.                                                                                                                                               | `false` |
| addBlankLine    | _boolean_ | Add a blank line between the content of each file, which is equivalent to inserting `\n\n`.                                                                                                       | `false` |
| includeFilename | _boolean_ | When this is set to `true`, _Pedantry_ will write data in object mode, pushing an object with `file` and `data` properties. New and blank lines will have the `file` property set to `separator`. | `false` |

_Given the directory structure:_

```m
example/test
├── 1-words.md
├── 11-to-live.md
├── 2-believe.md
├── 3-brick.md
├── footer.md
└── index.md
```

_The usage of **Pedantry** is as below:_

```js
import Pedantry from 'pedantry'

const pedantry = new Pedantry('example/test')
pedantry.pipe(process.stdout)
```

```markdown
# index.md: Welcome to Quotes

This is a collection of quotes.

## 1-words.md: Mikhail Bulgakov, The Master and Margarita

“You pronounced your words as if you don’t acknowledge the shadows, or the evil
either. Would you be so kind as to give a little thought to the question of what
your good would be doing if evil did not exist, and how the earth would look if
the shadows were to disappear from it?”

## 2-believe.md: Mikhail Bulgakov, The Master and Margarita

“I believe you!' the artiste exclaimed finally and extinguishes his gaze. 'I do!
These eyes are not lying! How many times have I told you that your basic error
consists in underestimating the significance of the human eye. Understand that
the tongue can conceal the truth, but the eyes - never! A sudden question is put
to you, you don't even flinch, in one second you get hold of yourself and know
what you must say to conceal the truth, and you speak quite convincingly, and
not a wrinkle on your face moves, but - alas - the truth which the question
stirs up from the bottom of your soul leaps momentarily into your eyes, and it's
all over! They see it, and you're caught!”

## 3-brick.md: Mikhail Bulgakov, The Master and Margarita

“The brick is neither here nor there,' interrupted the stranger in an imposing
fashion, 'it never merely falls on someone's head from out of nowhere. In your
case, I can assure you that a brick poses no threat whatsoever. You will die
another kind of death."

'And you know just what that will be?' queried Berlioz with perfectly
understandable irony, letting himself be drawn into a truly absurd conversation.
'And can you tell me what that is?'

'Gladly,' replied the stranger. He took Berlioz's measure as if intending to
make him a suit and muttered something through his teeth that sounded like 'One,
two.. Mercury in the Second House... the moon has set... six-misfortune...
evening-seven...' Then he announced loudly and joyously, 'Your head will be cut
off!”

## 11-to-live.md: Friedrich Nietzsche

> To live is to suffer, to survive is to find some meaning in the suffering.

## footer.md: Copyright

[source](https://www.goodreads.com/work/quotes/876183?page=2)
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true" width="15"></a></p>

### Reverse Order

To print in reverse order, the `reverse` option can be set. This feature could be useful when writing a blog, for example, as date 23 will follow 22, and in the output it will be printed first.

_With a simpler directory structure:_

```m
example/simple-test
├── 1-file.md
├── 100-world.md
├── 2-test.md
├── 21-hello.md
├── footer.md
└── index.md
```

_It could be printed in reverse:_

```js
import Pedantry from 'pedantry'

const pedantry = new Pedantry('example/simple-test', {
  reverse: true,
})
pedantry.pipe(process.stdout)
```

```markdown
index.md
100-world.md
21-hello.md
2-test.md
1-file.md
footer.md
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true" width="15"></a></p>

### Events

The _Pedantry_ stream will emit `file` events when a file is started to be read. The content of this event is the path to the currently read file relative to the source directory.

```js
import Pedantry from 'pedantry'

const pedantry = new Pedantry('example/simple-test')
pedantry.on('file', f => console.log(f))
```

```fs
index.md
1-file.md
2-test.md
21-hello.md
100-world.md
footer.md
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="15"></a></p>

### Object Mode

To get access to the currently processed file, _Pedantry_ can be run in object mode, in which it will emit the `data` event with an object consisting of `file` and `data` properties. If blank lines are added, their will be reported as coming from the `separator` file.

```js
import Pedantry from 'pedantry'
import { Transform } from 'stream'

const pedantry = new Pedantry('example/simple-test', {
  includeFilename: true,
  addBlankLine: true,
})
const t = new Transform({
  objectMode: true,
  transform(object, _, next) {
    console.log(object)
    next()
  },
})
pedantry.pipe(t)
```
```fs
{ file: 'example/simple-test/index.md', data: 'index.md\n' }
{ file: 'separator', data: '\n\n' }
{ file: 'example/simple-test/1-file.md', data: '1-file.md\n' }
{ file: 'separator', data: '\n\n' }
{ file: 'example/simple-test/2-test.md', data: '2-test.md\n' }
{ file: 'separator', data: '\n\n' }
{ file: 'example/simple-test/21-hello.md',
  data: '21-hello.md\n' }
{ file: 'separator', data: '\n\n' }
{ file: 'example/simple-test/100-world.md',
  data: '100-world.md\n' }
{ file: 'separator', data: '\n\n' }
{ file: 'example/simple-test/footer.md', data: 'footer.md' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>