package main

import "testing"

func TestSumFromLine(t *testing.T) {
	tests := []struct {
		input    string
		expected int
	}{
		{"two1nine", 29},
		{"eightwothree", 83},
		{"abcone2threexyz", 13},
		{"xtwone3four", 24},
		{"4nineeightseven2", 42},
		{"zoneight234", 14},
		{"7pqrstsixteen", 76},
		{"8threesevenfourgbgteight5twonenjr", 81},
	}

	for _, test := range tests {
		var got = sumFromLine(test.input)
		var want = test.expected

		if got != want {
			t.Errorf("sumFromLine(%q) = %d, want %d", test.input, got, want)
		}
	}
}
