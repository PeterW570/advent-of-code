package main

import "testing"

func TestFindSmudgedReflectionCol(t *testing.T) {
	tests := []struct {
		input    []string
		expected int
	}{
		{[]string{
			"#.##..##.",
			"..#.##.#.",
			"##......#",
			"##......#",
			"..#.##.#.",
			"..##..##.",
			"#.#.##.#.",
		}, -1},
		{[]string{
			"#...##..#",
			"#....#..#",
			"..##..###",
			"#####.##.",
			"#####.##.",
			"..##..###",
			"#....#..#",
		}, -1},
	}

	for _, test := range tests {
		got := findSmudgedReflectionCol(test.input)
		if got != test.expected {
			t.Errorf("findReflectionCol(%v) = %d, want %d", test.input, got, test.expected)
		}
	}
}

func TestFindSmudgedReflectionRow(t *testing.T) {
	tests := []struct {
		input    []string
		expected int
	}{
		{[]string{
			"#.##..##.",
			"..#.##.#.",
			"##......#",
			"##......#",
			"..#.##.#.",
			"..##..##.",
			"#.#.##.#.",
		}, 3},
		{[]string{
			"#...##..#",
			"#....#..#",
			"..##..###",
			"#####.##.",
			"#####.##.",
			"..##..###",
			"#....#..#",
		}, 1},
	}

	for _, test := range tests {
		got := findSmudgedReflectionRow(test.input)
		if got != test.expected {
			t.Errorf("findReflectionRow(%v) = %d, want %d", test.input, got, test.expected)
		}
	}
}
