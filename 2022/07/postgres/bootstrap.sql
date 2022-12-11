CREATE TABLE day_07_dirs (
    id SERIAL PRIMARY KEY,
	"dirname" VARCHAR(255) NOT NULL,
	"parent_id" INT REFERENCES day_07_dirs (id) ON DELETE CASCADE,
	UNIQUE ("dirname", "parent_id")
);

CREATE TABLE day_07_files (
    id SERIAL PRIMARY KEY,
	"filename" VARCHAR(255) NOT NULL,
	"file_size" INT NOT NULL,
	"parent_id" INT NOT NULL REFERENCES day_07_dirs (id) ON DELETE CASCADE,
	UNIQUE ("filename", "parent_id")
);
