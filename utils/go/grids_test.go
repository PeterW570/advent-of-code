package aoc_utils

import "testing"

func TestManhattenDistanceTo(t *testing.T) {
	tests := []struct {
		start    Coords
		end      Coords
		expected int
	}{
		{Coords{Row: 0, Col: 0}, Coords{Row: 0, Col: 4}, 4},
		{Coords{Row: 0, Col: 0}, Coords{Row: 4, Col: 0}, 4},
		{Coords{Row: 0, Col: 0}, Coords{Row: 4, Col: 4}, 8},
	}

	for _, test := range tests {
		got := test.start.ManhattenDistanceTo(test.end)
		if got != test.expected {
			t.Errorf("findShortestPath(%v, %v) = %v, want %v", test.start, test.end, got, test.expected)
		}
	}
}
