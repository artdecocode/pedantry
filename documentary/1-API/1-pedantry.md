## class `Pedantry`

A _Pedantry_ instance reads files in order one-by-one and pushes the results further down the pipe.

```### constructor => Pedantry
[
  ["source", "string"],
  ["options?", "Options"]
]
```

<!-- Instances of the `Pedantry` class will start reading the directory and push data immediately. The data is a merged buffer of contents of all files. -->

Create a new readable stream. Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order:

1. the content of the `index.md` file will go first if it exists,
1. then of all files and directories in the folder recursively in a sorted order (possibly in reverse),
1. and the content of the `footer.md` file will go last if found.

%TYPEDEF types/index.xml%

_Given the directory structure:_

%TREE example/test%

_The usage of **Pedantry** is as below:_

%EXAMPLE: example/Pedantry, ../src => pedantry%
%FORK-markdown example/Pedantry.js%

%~ width="15"%