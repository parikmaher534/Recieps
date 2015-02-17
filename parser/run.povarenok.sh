#!/bin/bash

n=1
for ((  i = 2 ;  i <= 5500;  i += $n  ))
do
  res=`expr $i + $n`
  nohup node povarenok.ru.js --from=$i --to=$res > output.log; sleep 10;
  echo "$res"
done