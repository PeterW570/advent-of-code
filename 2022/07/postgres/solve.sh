#!/bin/bash

database_name="advent-of-code-2022"

psql -d "$database_name" -f "$(dirname $0)/part-01.sql"
psql -d "$database_name" -f "$(dirname $0)/part-02.sql"
