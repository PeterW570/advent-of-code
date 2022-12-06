#!/bin/bash

database_name="advent-of-code-2022"

# Initialize a counter to keep track of the number of elves
counter=1

# Run the bootstrap.sql file in psql
psql -d "$database_name" -f "$(dirname $0)/bootstrap.sql"

# Read the input file line by line
while IFS='' read -r line || [[ -n "$line" ]]; do
    # If the line is blank, increment the counter and skip it
    if [ -z "$line" ]; then
        ((counter++))
        continue
    fi

    # Otherwise, insert the value and the current elf name into the database
    psql -d "$database_name" -c "INSERT INTO \"day_01_elf_calories\" (calories, elf_name) VALUES ($line, 'elf_$counter')"
done < "$(dirname $0)/../input.txt"
