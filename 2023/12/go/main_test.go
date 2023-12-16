package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestSimplifyInput(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"???.###", "???.###"},
		{".??..??...?##.", ".??.??.?##."},
		{"?#?#?#?#?#?#?#?", "?#?#?#?#?#?#?#?"},
		{"????.#...#...", "????.#.#."},
		{"????.######..#####.", "????.######.#####."},
		{"?###????????", "?###????????"},
	}

	for _, test := range tests {
		got := simplifyInput(test.input)
		want := test.expected

		if got != want {
			t.Errorf("parseStrToSpringTypes(%q) = %q, want %q", test.input, got, want)
		}
	}
}

func TestGetSpringCounts(t *testing.T) {
	tests := []struct {
		input    string
		expected []int
	}{
		{"#.#.###", []int{1, 1, 3}},
		{".#...#....###.", []int{1, 1, 3}},
		{".#.###.#.######", []int{1, 3, 1, 6}},
		{"####.#...#...", []int{4, 1, 1}},
		{"#....######..#####.", []int{1, 6, 5}},
		{".###.##....#", []int{3, 2, 1}},
	}

	for _, test := range tests {
		got := getSpringCounts(test.input)
		if !cmp.Equal(got, test.expected) {
			t.Errorf("getSpringCounts(%q) = %v, want %v", test.input, got, test.expected)
		}
	}
}

func TestFindPossibilities(t *testing.T) {
	tests := []struct {
		input    string
		sizes    []int
		expected int
	}{
		{"???.###", []int{1, 1, 3}, 1},
		{".??.??.?##.", []int{1, 1, 3}, 4},
		{"?#?#?#?#?#?#?#?", []int{1, 3, 1, 6}, 1},
		{"????.#.#.", []int{4, 1, 1}, 1},
		{"????.######.#####.", []int{1, 6, 5}, 4},
		{"?###????????", []int{3, 2, 1}, 10},
	}

	for _, test := range tests {
		got := findPossibilities(test.input, test.sizes)
		want := test.expected
		if got != want {
			t.Errorf("findPossibilities(%q, %v) = %d, want %d", test.input, test.sizes, got, want)
		}
	}
}
