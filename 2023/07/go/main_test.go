package main

import "testing"

func TestClassifyHand(t *testing.T) {
	tests := []struct {
		input    string
		expected handClassification
	}{
		{"32T3K", onePair},
		{"T55J5", threeOfAKind},
		{"KK677", twoPair},
		{"KTJJT", twoPair},
		{"QQQJA", threeOfAKind},
	}

	for _, test := range tests {
		want := test.expected
		got := classifyHand(test.input)

		if got != want {
			t.Errorf("classifyHand(%q) = %d, want %d", test.input, got, want)
		}
	}
}
