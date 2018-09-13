
```## constructor => Pedantry
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

Given the directory structure:

%TREE example/test%

The usage of `Pedantry` is as below:

%EXAMPLE: example/Pedantry.js, ../src => pedantry%

%FORK-markdown example example/Pedantry.js%

## Reverse Order

To print in reverse order, the `reverse` option can be set. This feature could be useful when writing a blog, for example, as 23 will follow 22, and in the output it will be printed first.

With a simpler directory structure:

%TREE example/simple-test%

It could be printed in reverse.

%EXAMPLE: example/reverse.js, ../src => pedantry%

%FORK-markdown example example/reverse.js%
