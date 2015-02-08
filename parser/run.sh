#!/bin/bash

n=5
for ((  i = 2 ;  i <= 5500;  i += $n  ))
do
  res=`expr $i + $n`
  node parser/edimdoma.ru.js --from=$i --to=$res;
  echo "$res"
done