-- Find the sum of the size of all directories needed to delete
-- to leave 30_000_000 free space in the filesystem (max size: 70_000_000)

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

WITH contants AS (
    SELECT 30000000 - 70000000 + SUM(file_size) AS to_free_up FROM day_07_files
)
SELECT dir_size AS part_2_solution FROM (
	SELECT
		all_files.root_id,
		SUM(all_files.file_size) as dir_size
	FROM get_all_files_in_all_dirs as all_files
	GROUP BY all_files.root_id
) dir_sizes
WHERE dir_size >= (SELECT to_free_up FROM contants)
ORDER BY dir_size ASC
LIMIT 1;
