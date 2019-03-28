## compiles files in order
test/fixture/order

/* expected */
index
1-test
2-test
11-test
footer
/**/

## compiles files in reverse order
test/fixture/order

/* options */
{"reverse": true}
/**/

/* expected */
index
11-test
2-test
1-test
footer
/**/

## adds new line to files
test/fixture/new-lines

/* options */
{"addNewLine": true}
/**/

/* expected */
index
1-file
2-file
footer
/**/

## adds blank line to files
test/fixture/new-lines

/* options */
{"addBlankLine": true}
/**/

/* expected */
index

1-file

2-file

footer
/**/