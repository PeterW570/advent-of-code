import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var current = 50
    let STEPS = 100

    var solution = 0
    for line in lines {
        // print(line)
        guard var distance = Int(line.dropFirst()) else { continue }

        let fullSpins = distance / STEPS
        solution += fullSpins
        distance %= STEPS

        var next = current
        if line.first == "L" {
            next -= distance
        } else if line.first == "R" {
            next += distance
        }

        if current != 0 && (next < 0 || next > STEPS) {
            solution += 1
        }

        current = (next + STEPS) % STEPS
        if current == 0 {
            solution += 1
        }
    }

    return "Solution: \(solution)"
}
