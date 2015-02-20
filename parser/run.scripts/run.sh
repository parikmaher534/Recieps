#!/bin/bash

n=1
for ((  i = 1 ;  i <= 5500;  i += $n  ))
do
  nohup node edimdoma.ru.js --from=$i --to=$i > output.log;
  echo "$i"
done