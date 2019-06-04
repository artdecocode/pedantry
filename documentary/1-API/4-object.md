### Object Mode

To get access to the currently processed file, _Pedantry_ can be run in object mode, in which it will emit the `data` event with an object consisting of `file` and `data` properties. If blank lines are added, their will be reported as coming from the `separator` file.

%EXAMPLE: example/object, ../src => pedantry%
%FORK-fs example/object%

%~ width="15"%