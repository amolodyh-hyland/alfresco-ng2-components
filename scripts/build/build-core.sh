#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

echo "====== Core ======"

echo "====== Prebuilt Themes ====="
nx affected $NX_CALCULATION_FLAGS --target=pretheme
