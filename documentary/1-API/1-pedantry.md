
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

%EXAMPLE: example/Pedantry.js, ../src => pedantry%
