// compiles files in order
test/fixture/order

/* expected */
index
1-test
2-test
11-test
footer
/**/

// compiles files in reverse order
test/fixture/order
{"reverse": true}

/* expected */
index
11-test
2-test
1-test
footer
/**/