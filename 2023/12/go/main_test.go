package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestParseStrToSpringTypes(t *testing.T) {
	input := ".#?..#.?."
	want := []springType{operational, damaged, unknown, operational, operational, damaged, operational, unknown, operational}

	got := make([]springType, 0)
	parseStrToSpringTypes(input, &got)

	if !cmp.Equal(got, want) {
		t.Errorf("parseStrToSpringTypes(%q) = %v, want %v", input, got, want)
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
		input := make([]springType, 0)
		parseStrToSpringTypes(test.input, &input)

		got := getSpringCounts(input)
		if !cmp.Equal(got, test.expected) {
			t.Errorf("getSpringCounts(%q) = %v, want %v", test.input, got, test.expected)
		}
	}
}

func TestGetPossibleDamagedCounts(t *testing.T) {
	tests := []struct {
		input    string
		expected [][]int
	}{
		{"#???.##???", [][]int{{1, 2, 3, 4}, {}, {1, 2}, {1}, {}, {2, 3, 4, 5}, {}, {}, {1, 2}, {1}}},
	}

	for _, test := range tests {
		input := make([]springType, 0)
		parseStrToSpringTypes(test.input, &input)
		got := getPossibleDamagedCounts(input)
		want := test.expected

		if !cmp.Equal(got, want) {
			t.Errorf("getPossibleDamagedCounts(%q) = %v, want %v", test.input, got, want)
		}
	}
}
