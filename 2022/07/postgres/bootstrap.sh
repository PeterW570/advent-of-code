#!/bin/bash

dir_id_lookup_file=$(mktemp) || exit
echo $dir_id_lookup_file
trap 'rm "$dir_id_lookup_file"; exit' ERR EXIT  # HUP INT TERM

database_name="advent-of-code-2022"
dir_table_name="day_07_dirs"
file_table_name="day_07_files"

# Run the bootstrap.sql file in psql
psql -d "$database_name" -f "$(dirname $0)/bootstrap.sql"

current_path=()

while read -r line || [[ -n "$line" ]]; do
	if [[ "$line" == "$ ls" ]]; then  # list files/dirs
		continue; # do nothing
	elif [[ "$line" == "$ cd .." ]]; then # move up
		unset 'current_path[${#current_path[@]}-1]'
	elif [[ "$line" =~ ^\$\ cd\  ]]; then # move in
		dirname=$(echo $line | cut -d ' ' -f 3)
		current_path+=($dirname)
	elif [[ "$line" =~ ^dir\  ]]; then # dir listed
		parent_dir_path=$(IFS='/'; echo "${current_path[*]:1}")
		dirname=$(echo $line | cut -d ' ' -f 2)

		if [ -z $parent_dir_path ]; then
			dir_path="$dirname"
		else
			dir_path="$parent_dir_path/$dirname"
		fi

		if grep -q "^$dir_path " $dir_id_lookup_file; then
			continue; # already created
		else
			parent_id=$(grep "^$parent_dir_path " $dir_id_lookup_file | cut -d ' ' -f2)

			# todo: probably shouldn't just shove the dirname in the query, I trust the input not to be malicious though...
			dir_id=$(psql -d "$database_name" -c "INSERT INTO $dir_table_name (dirname, parent_id) VALUES ('$dirname', ${parent_id:-null}) RETURNING id;" | awk 'NR==3 {print $1}')
			echo "$dir_path $dir_id" >> $dir_id_lookup_file
		fi
	else # file listed
		parent_dir_path=$(IFS='/'; echo "${current_path[*]:1}")
		parent_id=$(grep "^$parent_dir_path " $dir_id_lookup_file | cut -d ' ' -f2)
		file_size=$(echo $line | cut -d ' ' -f 1)
		filename=$(echo $line | cut -d ' ' -f 2)

		psql -d "$database_name" -c "INSERT INTO $file_table_name (filename, file_size, parent_id) VALUES ('$filename', $file_size, $parent_id);"
	fi
done < "$(dirname $0)/../input.txt"
