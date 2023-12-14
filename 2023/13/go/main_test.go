package main

import "testing"

func TestFindReflectionCol(t *testing.T) {
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
		}, 5},
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
		got := findReflectionCol(test.input)
		if got != test.expected {
			t.Errorf("findReflectionCol(%v) = %d, want %d", test.input, got, test.expected)
		}
	}
}

func TestFindReflectionRow(t *testing.T) {
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
		}, 4},
	}

	for _, test := range tests {
		got := findReflectionRow(test.input)
		if got != test.expected {
			t.Errorf("findReflectionRow(%v) = %d, want %d", test.input, got, test.expected)
		}
	}
}
