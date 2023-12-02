package main

import "testing"

func TestParseLine(t *testing.T) {
	tests := []struct {
		input            string
		expectedGameNum  int
		expectedMaxRed   int
		expectedMaxGreen int
		expectedMaxBlue  int
	}{
		{"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green", 1, 4, 2, 6},
		{"Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue", 2, 1, 3, 4},
		{"Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red", 3, 20, 13, 6},
		{"Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red", 4, 14, 3, 15},
		{"Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green", 5, 6, 3, 2},
	}

	for _, test := range tests {
		var got = parseLine(test.input)
		var wantGameNum = test.expectedGameNum
		var wantBlue = test.expectedMaxBlue
		var wantGreen = test.expectedMaxGreen
		var wantRed = test.expectedMaxRed

		if got.gameNumber != wantGameNum {
			t.Errorf("parseLine(%q).gameNumber = %d, want %d", test.input, got.gameNumber, wantGameNum)
		}
		if got.maxCounts["blue"] != wantBlue {
			t.Errorf("parseLine(%q).maxCounts[\"blue\"] = %d, want %d", test.input, got.maxCounts["blue"], wantBlue)
		}
		if got.maxCounts["green"] != wantGreen {
			t.Errorf("parseLine(%q).maxCounts[\"green\"] = %d, want %d", test.input, got.maxCounts["green"], wantGreen)
		}
		if got.maxCounts["red"] != wantRed {
			t.Errorf("parseLine(%q).maxCounts[\"red\"] = %d, want %d", test.input, got.maxCounts["red"], wantRed)
		}
	}
}
