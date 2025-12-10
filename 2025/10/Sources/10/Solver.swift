import Foundation
import SwiftZ3

struct Instruction {
    let buttons: [[Int]]
    let targetState: [Int]
}

func parseInstruction(_ line: String) -> Instruction? {
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

    return Instruction(buttons: buttons, targetState: joltage)
}

func solveForInstructions(instruction: Instruction) -> Int {
    let context = Z3Context()
    let optimizer = context.makeOptimize()

    // Create integer constants for button presses
    let presses = instruction.buttons.indices.compactMap { i in
        context.makeConstant(name: "p\(i)", sort: context.intSort()).castTo(sort: IntSort.self)
    }

    guard presses.count > 0 else {
        print("No buttons found in instruction.")
        return 0
    }

    // Add constraints that all presses are >= 0
    for press in presses {
        optimizer.assert(press >= 0)
    }

    // For each target state, add constraint that sum of affecting presses equals target
    for i in instruction.targetState.indices {
        let affectingPresses = presses.enumerated().compactMap { (j, press) in
            instruction.buttons[j].contains(i) ? press : nil
        }

        if !affectingPresses.isEmpty {
            let sum: Z3Int =
                affectingPresses.count == 1
                ? affectingPresses[0]
                : affectingPresses.dropFirst().reduce(affectingPresses[0], +)
            optimizer.assert(sum == Int32(instruction.targetState[i]))
        }
    }

    // Minimize sum of all presses
    let totalPresses: Z3Int =
        presses.count == 1
        ? presses[0]
        : presses.dropFirst().reduce(presses[0], +)
    _ = optimizer.minimize(totalPresses)

    // Check and get model
    guard optimizer.check() == .satisfiable else {
        return 0
    }

    let model = optimizer.getModel()

    // Sum the press values
    return presses.reduce(0) { sum, press in
        sum + Int(model.int(press))
    }
}

func solve(input: String) -> String {
    let instructions =
        input
        .split(whereSeparator: \.isNewline)
        .compactMap { line -> Instruction? in
            guard let instruction = parseInstruction(String(line)) else {
                return nil
            }
            return instruction
        }

    var solution = 0

    for instruction in instructions {
        let presses = solveForInstructions(instruction: instruction)
        solution += presses
    }

    return "Solution: \(solution)"
}
