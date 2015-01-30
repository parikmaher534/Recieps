#!/bin/bash

cd public/frontend;

rm -rf .bem/cache;

node_modules/.bin/bem make;
