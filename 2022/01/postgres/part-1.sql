SELECT MAX(total_calories) AS max_total_calories
FROM (
    SELECT elf_name, SUM(calories) AS total_calories
    FROM day_01_elf_calories
    GROUP BY elf_name
) t;
