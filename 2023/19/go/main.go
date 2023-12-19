package main

import (
	"flag"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type categoryType int

const (
	nilCategory categoryType = iota
	extremelyCool
	musical
	aerodynamic
	shiny
)

var categoryMap = map[string]categoryType{
	"x": extremelyCool,
	"m": musical,
	"a": aerodynamic,
	"s": shiny,
}

type conditionType int

const (
	nilCondition conditionType = iota
	greaterThan
	lessThan
)

type ruleResult int

const (
	approve ruleResult = iota + 1
	reject
	goToWorkflow
)

type Rule struct {
	Category  categoryType
	Condition conditionType
	Value     int
	OnSuccess ruleResult
	GoToLabel string
}

type Workflow struct {
	Label string
	Rules []Rule
}

type PartRatings map[categoryType]int

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	workflowsByLabel := make(map[string]Workflow)
	parts := make([]PartRatings, 0)

	parsingWorkflows := true
	utils.IterateFileLines("../"+fileName, func(line string) {
		if len(strings.TrimSpace(line)) == 0 {
			parsingWorkflows = false
		} else if parsingWorkflows {
			workflow := parseWorkflowInput(line)
			workflowsByLabel[workflow.Label] = workflow
		} else {
			partRatings := parsePartInput(line)
			parts = append(parts, partRatings)
		}
	})

	partOneTotal := 0
	for _, part := range parts {
		if shouldApprovePart(part, workflowsByLabel) {
			for _, val := range part {
				partOneTotal += val
			}
		}
	}
	fmt.Printf("Part 1: %d\n", partOneTotal)

	mins := map[categoryType]float64{
		extremelyCool: 1,
		musical:       1,
		aerodynamic:   1,
		shiny:         1,
	}
	maxes := map[categoryType]float64{
		extremelyCool: 4000,
		musical:       4000,
		aerodynamic:   4000,
		shiny:         4000,
	}
	partTwoTotal := findApprovedRanges(workflowsByLabel["in"], workflowsByLabel, mins, maxes)
	fmt.Printf("Part 2: %d\n", int(partTwoTotal))
}

func copyMap(toCopy map[categoryType]float64) map[categoryType]float64 {
	copied := make(map[categoryType]float64)
	for key, val := range toCopy {
		copied[key] = val
	}
	return copied
}

func findApprovedRanges(start Workflow, workflowsByLabel map[string]Workflow, mins, maxes map[categoryType]float64) float64 {
	var possibilities float64 = 0
	currWorkflow := start

	for {
		var nextWorkFlow Workflow
		for _, rule := range currWorkflow.Rules {
			if rule.Condition == lessThan {
				successMins := copyMap(mins)
				successMaxes := copyMap(maxes)
				successMaxes[rule.Category] = math.Min(maxes[rule.Category], float64(rule.Value-1))

				mins[rule.Category] = math.Max(mins[rule.Category], float64(rule.Value))

				if rule.OnSuccess == approve {
					possibilities += calcCombinations(successMins, successMaxes)
				} else if rule.OnSuccess != reject {
					possibilities += findApprovedRanges(workflowsByLabel[rule.GoToLabel], workflowsByLabel, successMins, successMaxes)
				}
			} else if rule.Condition == greaterThan {
				successMins := copyMap(mins)
				successMaxes := copyMap(maxes)
				successMins[rule.Category] = math.Max(mins[rule.Category], float64(rule.Value+1))

				maxes[rule.Category] = math.Min(maxes[rule.Category], float64(rule.Value))

				if rule.OnSuccess == approve {
					possibilities += calcCombinations(successMins, successMaxes)
				} else if rule.OnSuccess != reject {
					possibilities += findApprovedRanges(workflowsByLabel[rule.GoToLabel], workflowsByLabel, successMins, successMaxes)
				}
			} else {
				switch rule.OnSuccess {
				case approve:
					return possibilities + calcCombinations(mins, maxes)
				case reject:
					return possibilities
				default:
					return possibilities + findApprovedRanges(workflowsByLabel[rule.GoToLabel], workflowsByLabel, mins, maxes)
				}
			}
		}
		if nextWorkFlow.Label == currWorkflow.Label {
			panic("Hopefully shouldn't happen")
		} else {
			currWorkflow = nextWorkFlow
		}
	}
}

func calcCombinations(mins, maxes map[categoryType]float64) float64 {
	if mins[extremelyCool] > maxes[extremelyCool] {
		return 0
	} else if mins[musical] > maxes[musical] {
		return 0
	} else if mins[aerodynamic] > maxes[aerodynamic] {
		return 0
	} else if mins[shiny] > maxes[shiny] {
		return 0
	}
	return (maxes[extremelyCool] + 1 - mins[extremelyCool]) *
		(maxes[musical] + 1 - mins[musical]) *
		(maxes[aerodynamic] + 1 - mins[aerodynamic]) *
		(maxes[shiny] + 1 - mins[shiny])
}

func shouldApprovePart(part PartRatings, workflowsByLabel map[string]Workflow) bool {
	currWorkflow := workflowsByLabel["in"]
	for {
		var nextWorkFlow Workflow
	ruleLoop:
		for _, rule := range currWorkflow.Rules {
			var isSuccess bool
			switch rule.Condition {
			case lessThan:
				isSuccess = part[rule.Category] < rule.Value
			case greaterThan:
				isSuccess = part[rule.Category] > rule.Value
			default:
				isSuccess = true
			}

			if isSuccess {
				switch rule.OnSuccess {
				case approve:
					return true
				case reject:
					return false
				default:
					nextWorkFlow = workflowsByLabel[rule.GoToLabel]
					break ruleLoop
				}
			}
		}
		if nextWorkFlow.Label == currWorkflow.Label {
			panic("Hopefully shouldn't happen")
		} else {
			currWorkflow = nextWorkFlow
		}
	}
}

func parseWorkflowInput(input string) Workflow {
	workflowRe := regexp.MustCompile(`(\w+){(.+)}`)
	matches := workflowRe.FindStringSubmatch(input)

	ruleRe := regexp.MustCompile(`(\w+)[<>](\d+):(\w+)`)

	if len(matches) != 3 {
		panic("couldn't parse input")
	}

	label := matches[1]
	rules := make([]Rule, 0)
	for _, ruleStr := range strings.Split(matches[2], ",") {
		parsedRule := Rule{}

		var categoryStr string
		var valueStr string
		var onSuccessStr string
		if strings.Contains(ruleStr, ">") {
			parsedRule.Condition = greaterThan
			ruleMatches := ruleRe.FindStringSubmatch(ruleStr)
			categoryStr = ruleMatches[1]
			valueStr = ruleMatches[2]
			onSuccessStr = ruleMatches[3]
		} else if strings.Contains(ruleStr, "<") {
			parsedRule.Condition = lessThan
			ruleMatches := ruleRe.FindStringSubmatch(ruleStr)
			categoryStr = ruleMatches[1]
			valueStr = ruleMatches[2]
			onSuccessStr = ruleMatches[3]
		} else {
			onSuccessStr = ruleStr
		}

		if categoryStr != "" {
			parsedRule.Category = categoryMap[categoryStr]
		}

		value, error := strconv.Atoi(valueStr)
		if error == nil {
			parsedRule.Value = value
		}

		switch onSuccessStr {
		case "A":
			parsedRule.OnSuccess = approve
		case "R":
			parsedRule.OnSuccess = reject
		default:
			parsedRule.OnSuccess = goToWorkflow
			parsedRule.GoToLabel = onSuccessStr
		}

		rules = append(rules, parsedRule)
	}

	return Workflow{
		Label: label,
		Rules: rules,
	}
}

func parsePartInput(input string) PartRatings {
	parsed := PartRatings{}

	splits := strings.Split(input[1:len(input)-1], ",")

	for _, split := range splits {
		splitSplits := strings.Split(split, "=")
		value, _ := strconv.Atoi(splitSplits[1])
		parsed[categoryMap[splitSplits[0]]] = value
	}

	return parsed
}
