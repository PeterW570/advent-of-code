SELECT SUM(total_calories) AS top_3_total_calories
FROM (
    SELECT elf_name, SUM(calories) AS total_calories
    FROM day_01_elf_calories
    GROUP BY elf_name
    ORDER BY total_calories DESC
    LIMIT 3
) t;
