package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestParseSeedLine(t *testing.T) {
	input := "seeds: 79 14 55 13"
	want := []int{79, 14, 55, 13}

	got := ParseSeedLine(input)

	if !cmp.Equal(got, want) {
		t.Errorf("ParseSeedLine(%q) = %v, want %v", input, got, want)
	}
}

func TestParseMapLine(t *testing.T) {
	input := "50 98 2"
	want := MapLine{
		DestRangeStart:   50,
		SourceRangeStart: 98,
		Range:            2,
	}

	got := ParseMapLine(input)

	if !cmp.Equal(got, want) {
		t.Errorf("ParseMapLine(%q) = %v, want %v", input, got, want)
	}
}
