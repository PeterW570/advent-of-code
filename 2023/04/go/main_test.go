package main

import "testing"

func TestParseLine(t *testing.T) {
	tests := []struct {
		input          string
		expectedNum    int
		expectedPoints int
	}{
		{"Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53", 1, 4},
		{"Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19", 2, 2},
		{"Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1", 3, 2},
		{"Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83", 4, 1},
		{"Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36", 5, 0},
		{"Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11", 6, 0},
	}

	for _, test := range tests {
		var got = parseLine(test.input)
		var wantNum = test.expectedNum
		var wantPoints = test.expectedPoints

		if got.CardNumber != wantNum {
			t.Errorf("parseLine(%q) -> CardNumber = %d, want %d", test.input, got.CardNumber, wantNum)
		}
		if got.Points != wantPoints {
			t.Errorf("parseLine(%q) -> Points = %d, want %d", test.input, got.Points, wantPoints)
		}
	}
}
