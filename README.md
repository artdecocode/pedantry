# pedantry

[![npm version](https://badge.fury.io/js/pedantry.svg)](https://npmjs.org/package/pedantry)

`pedantry` is a Node.js package that implements a readable stream which puts together of all files in the directory in the sorted order. It also supports reading `index.md` and `footer.md` as first and last files respectively if found.

```sh
yarn add -E pedantry
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [class `Pedantry`](#class-pedantry)
  * [`constructor(source: string, options?: Options): Pedantry`](#constructorsource-stringoptions-options-pedantry)
    * [`Options`](#options)
  * [Reverse Order](#reverse-order)
  * [Events](#events)
- [TODO](#todo)
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

__<a name="options">`Options`</a>__: Options for Pedantry.

|  Name   |   Type    |                                   Description                                   | Default |
| ------- | --------- | ------------------------------------------------------------------------------- | ------- |
| reverse | _boolean_ | Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. | `false` |

Given the directory structure:

```m
example/test
├── 1-words.md
├── 11-to-live.md
├── 2-believe.md
├── 3-brick.md
├── footer.md
└── index.md
```

The usage of `Pedantry` is as below:

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

### Reverse Order

To print in reverse order, the `reverse` option can be set. This feature could be useful when writing a blog, for example, as 23 will follow 22, and in the output it will be printed first.

With a simpler directory structure:

```m
example/simple-test
├── 1-file.md
├── 100-world.md
├── 2-test.md
├── 21-hello.md
├── footer.md
└── index.md
```

It could be printed in reverse.

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

### Events

The _Pedantry_ stream will emit `file` events when a file is started to be read. The content of this event is a path to the currently read file relative to the source directory.

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

## TODO

- [ ] Add a todo list item.

## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz