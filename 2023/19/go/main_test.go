package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestParseWorkflowInput(t *testing.T) {
	tests := []struct {
		input  string
		output Workflow
	}{
		{
			input: "px{a<2006:qkq,m>2090:A,rfg}",
			output: Workflow{
				Label: "px",
				Rules: []Rule{
					{
						Category:  aerodynamic,
						Condition: lessThan,
						Value:     2006,
						OnSuccess: goToWorkflow,
						GoToLabel: "qkq",
					},
					{
						Category:  musical,
						Condition: greaterThan,
						Value:     2090,
						OnSuccess: approve,
					},
					{
						Category:  nilCategory,
						Condition: nilCondition,
						OnSuccess: goToWorkflow,
						GoToLabel: "rfg",
					},
				},
			},
		},
		{
			input: "pv{a>1716:R,A}",
			output: Workflow{
				Label: "pv",
				Rules: []Rule{
					{
						Category:  aerodynamic,
						Condition: greaterThan,
						Value:     1716,
						OnSuccess: reject,
					},
					{
						Category:  nilCategory,
						Condition: nilCondition,
						OnSuccess: approve,
					},
				},
			},
		},
	}

	for _, test := range tests {
		got := parseWorkflowInput(test.input)
		want := test.output

		if !cmp.Equal(got, want) {
			t.Errorf("parseWorkflowInput(%q) = %v; want %v", test.input, got, want)
		}
	}
}

func TestParsePartInput(t *testing.T) {
	input := "{x=787,m=2655,a=1222,s=2876}"
	got := parsePartInput(input)
	want := PartRatings{
		extremelyCool: 787,
		musical:       2655,
		aerodynamic:   1222,
		shiny:         2876,
	}

	if !cmp.Equal(got, want) {
		t.Errorf("parsePartInput(%q) = %v; want %v", input, got, want)
	}
}
