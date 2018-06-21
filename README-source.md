# pedantry

%NPM: pedantry%

`pedantry` is a Node.js package that implements a readable stream of all files in the directory.

```sh
yarn add -E pedantry
```

## Table Of Contents

%TOC%

## API

The main export of the program is the `Pedantry` Read Stream.

```js
import Pedantry from 'pedantry'
```

```## constructor => Pedantry
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

```fs
example/test
├── 1-words.md
├── 2-believe.md
├── 3-brick.md
├── footer.md
└── index.md
```

And the usage of `Pedantry` as below:

%EXAMPLE: example/Pedantry.js, ../src => pedantry, javascript%

The output will look as below:

```
# Welcome to Quotes

This is a collection of quotes.

## Mikhail Bulgakov, The Master and Margarita

“You pronounced your words as if you don’t acknowledge the shadows, or the evil either. Would you be so kind as to give a little thought to the question of what your good would be doing if evil did not exist, and how the earth would look if the shadows were to disappear from it?”

## Mikhail Bulgakov, The Master and Margarita

“I believe you!' the artiste exclaimed finally and extinguishes his gaze. 'I do! These eyes are not lying! How many times have I told you that your basic error consists in underestimating the significance of the human eye. Understand that the tongue can conceal the truth, but the eyes - never! A sudden question is put to you, you don't even flinch, in one second you get hold of yourself and know what you must say to conceal the truth, and you speak quite convincingly, and not a wrinkle on your face moves, but - alas - the truth which the question stirs up from the bottom of your soul leaps momentarily into your eyes, and it's all over! They see it, and you're caught!”

## Mikhail Bulgakov, The Master and Margarita

“The brick is neither here nor there,' interrupted the stranger in an imposing fashion, 'it never merely falls on someone's head from out of nowhere. In your case, I can assure you that a brick poses no threat whatsoever. You will die another kind of death."

'And you know just what that will be?' queried Berlioz with perfectly understandable irony, letting himself be drawn into a truly absurd conversation. 'And can you tell me what that is?'

'Gladly,' replied the stranger. He took Berlioz's measure as if intending to make him a suit and muttered something through his teeth that sounded like 'One, two.. Mercury in the Second House... the moon has set... six-misfortune...evening-seven...' Then he announced loudly and joyously, 'Your head will be cut off!”

---

[source](https://www.goodreads.com/work/quotes/876183?page=2)
```



---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
