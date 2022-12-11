-- Find the sum of the size of all directories which are <= 100000

CREATE TEMPORARY VIEW get_all_files_in_all_dirs AS
WITH RECURSIVE descendents AS (
	-- anchor part
	SELECT d.id, d.dirname, f.id as file_id, f.file_size, d.id as root_id
	FROM day_07_dirs d
	LEFT JOIN day_07_files f ON f.parent_id = d.id

	UNION ALL

	-- recursive part
	SELECT d.id, d.dirname, f.id as file_id, f.file_size, descendents.root_id
	FROM day_07_dirs d
	INNER JOIN descendents ON d.parent_id = descendents.id
	LEFT JOIN day_07_files f ON f.parent_id = d.id
)
SELECT
	DISTINCT ON (file_id, root_id)
	root_id,
	file_size
FROM descendents
WHERE file_size IS NOT NULL;

SELECT SUM(dir_size) AS part_1_solution FROM (
	SELECT
		root_id,
		SUM(file_size) as dir_size
	FROM get_all_files_in_all_dirs
	GROUP BY root_id
) dir_sizes WHERE dir_size <= 100000;
