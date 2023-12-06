package main

import "testing"

func TestParseNumFromLine(t *testing.T) {
	tests := []struct {
		input    string
		expected int
	}{
		{"Time:      7  15   30", 71530},
		{"Distance:  9  40  200", 940200},
	}

	for _, test := range tests {
		want := test.expected
		got := parseNumFromLine(test.input)

		if got != want {
			t.Errorf("parseNumFromLine(%q) = %d, want %d", test.input, got, want)
		}
	}
}

func TestFindWaysToWin(t *testing.T) {
	tests := []struct {
		time     int
		dist     int
		expected int
	}{
		{7, 9, 4},
		{15, 40, 8},
		{30, 200, 9},
	}

	for _, test := range tests {
		want := test.expected
		got := findWaysToWin(test.time, test.dist)

		if got != want {
			t.Errorf("findWaysToWin(%d, %d) = %d, want %d", test.time, test.dist, got, want)
		}
	}
}
