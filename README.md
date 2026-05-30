Load ONE
Store X
LOOP, Load X
Subt TEN
Skipcond 800
Jump BODY
Jump END

BODY, Load SUM
Add X
Store SUM
Load X
Add ONE
Store X
Jump LOOP

END, LOAD SUM
OUTPUT
Halt

SUM, DEC 0
X, DEC 0
ONE, DEC 1
TEN, DEC 10