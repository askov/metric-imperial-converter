#!/bin/bash
mkdir -p data
xterm -hold -e "mongod --config ./config/dev_db.yml" &
