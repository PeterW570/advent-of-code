import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var current = 50
    let STEPS = 100

    var solution = 0
    for line in lines {
        // print(line)
        guard let distance = Int(line.dropFirst()) else { continue }

        if line.first == "L" {
            current -= distance
        } else if line.first == "R" {
            current += distance
        }
        current = (current + STEPS) % STEPS
        if current == 0 {
            solution += 1
        }
    }

    return "Solution: \(solution)"
}
