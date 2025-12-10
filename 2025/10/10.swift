import Foundation

let isExample = CommandLine.arguments.contains("--example")
let inputPath = "input\(isExample ? ".example" : "").txt"

func readInput(at path: String) -> String {
    do {
        let url = URL(fileURLWithPath: path)
        return try String(contentsOf: url, encoding: .utf8)
    } catch {
        fputs("Error: Failed to read \(path): \(error)\n", stderr)
        exit(1)
    }
}

struct Instructions {
    let targetState: [Bool]
    let buttons: [[Int]]
    let joltage: [Int]
}

func parseInstructions(_ line: String) -> Instructions? {
    // Extract targetState: [.##.] -> [false, true, true, false]
    guard let stateMatch = line.range(of: #"\[([.#]+)\]"#, options: .regularExpression) else {
        return nil
    }
    let stateStr = String(line[stateMatch]).dropFirst().dropLast()
    let targetState = stateStr.map { $0 == "#" }
    
    // Extract buttons: (3) (1,3) (2) -> [[3], [1,3], [2], ...]
    let buttonPattern = #"\(([0-9,]+)\)"#
    let nsRange = NSRange(line.startIndex..., in: line)
    let regex = try! NSRegularExpression(pattern: buttonPattern)
    let matches = regex.matches(in: line, range: nsRange)
    
    let buttons = matches.map { match -> [Int] in
        let range = Range(match.range(at: 1), in: line)!
        let content = String(line[range])
        return content.split(separator: ",").compactMap { Int($0) }
    }
    
    // Extract joltage: {3,5,4,7} -> [3, 5, 4, 7]
    guard let joltageMatch = line.range(of: #"\{([0-9,]+)\}"#, options: .regularExpression) else {
        return nil
    }
    let joltageStr = String(line[joltageMatch]).dropFirst().dropLast()
    let joltage = joltageStr.split(separator: ",").compactMap { Int($0) }
    
    return Instructions(targetState: targetState, buttons: buttons, joltage: joltage)
}

struct PossibleSolution : Equatable, Hashable {
    var currentState: [Bool]
    var buttonPresses: [[Int]]
    var buttonIds: Set<Int> = Set<Int>()

    mutating func pressButton(_ button: [Int], _ buttonId: Int) {
        for index in button {
            guard index >= 0 && index < currentState.count else {
                continue
            }

            currentState[index].toggle()
        }
        buttonPresses.append(button)
        buttonIds.insert(buttonId)
    }

    func hasAlreadyPressed(_ buttonId: Int) -> Bool {
        return buttonIds.contains(buttonId)
    }

    func hasAlreadyPressed(_ ids: Set<Int>) -> Bool {
        return !self.buttonIds.isDisjoint(with: ids)
    }

    func isGoalState(_ targetState: [Bool]) -> Bool {
        return currentState == targetState
    }
    
    func key() -> String {
        let stateStr = currentState.map { $0 ? "1" : "0" }.joined()
        let idsStr = buttonIds.sorted().map(String.init).joined(separator: ",")
        return stateStr + "|" + idsStr
    }
}

func solve() -> String {
    let input = readInput(at: inputPath)
    let instructions = input
        .split(whereSeparator: \.isNewline)
        .compactMap { line -> Instructions? in
            guard let instruction = parseInstructions(String(line)) else {
                return nil
            }
            return instruction
        }

    var solution = 0
    instructionLoop: for instruction in instructions {
        let initialState = [Bool](repeating: false, count: instruction.targetState.count)
        var possibleSolutions = Set<PossibleSolution>()
        for i in 0..<instruction.buttons.count {
            let button = instruction.buttons[i]
            var possibleSolution = PossibleSolution(currentState: initialState, buttonPresses: [], buttonIds: Set<Int>())
            possibleSolution.pressButton(button, i)

            if possibleSolution.isGoalState(instruction.targetState) {
                solution += 1
                continue instructionLoop
            }

            possibleSolutions.insert(possibleSolution)
        }

        // Deterministic BFS using a queue and visited keys.
        var queue: [PossibleSolution] = Array(possibleSolutions)
        var visited = Set<String>()
        // mark initial frontier as visited
        for s in queue { visited.insert(s.key()) }

        while !queue.isEmpty {
            var newQueue: [PossibleSolution] = []

            for sol in queue {
                for i in 0..<instruction.buttons.count {
                    let button = instruction.buttons[i]

                    guard !sol.hasAlreadyPressed(i) else { continue }

                    var newSolution = sol
                    newSolution.pressButton(button, i)

                    let key = newSolution.key()
                    if visited.contains(key) { continue }
                    visited.insert(key)

                    if newSolution.isGoalState(instruction.targetState) {
                        solution += newSolution.buttonPresses.count
                        continue instructionLoop
                    }

                    newQueue.append(newSolution)
                }
            }

            queue = newQueue
        }
    }

    return "Solution: \(solution)"
}

print(solve())
