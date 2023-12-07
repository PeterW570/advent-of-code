package main

import "testing"

func TestClassifyHand(t *testing.T) {
	tests := []struct {
		input    string
		expected handClassification
	}{
		{"32T3K", onePair},
		{"T55J5", fourOfAKind},
		{"KK677", twoPair},
		{"KTJJT", fourOfAKind},
		{"QQQJA", fourOfAKind},
	}

	for _, test := range tests {
		want := test.expected
		got := classifyHand(test.input)

		if got != want {
			t.Errorf("classifyHand(%q) = %d, want %d", test.input, got, want)
		}
	}
}
