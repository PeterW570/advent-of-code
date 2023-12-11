package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestExpandSpace(t *testing.T) {
	input := [][]cellType{
		{empty, empty, galaxy},
		{empty, empty, empty},
		{galaxy, empty, empty},
	}
	want := [][]cellType{
		{empty, empty, empty, galaxy},
		{empty, empty, empty, empty},
		{empty, empty, empty, empty},
		{galaxy, empty, empty, empty},
	}

	got := expandSpace(input)

	if !cmp.Equal(got, want) {
		t.Errorf("expandSpace(...) = %v, want %v", got, want)
	}
}
