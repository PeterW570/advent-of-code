import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    let steps = 100
    let initialPosition = 50

    var current = initialPosition
    var solution = 0

    for line in lines {
        guard var distance = Int(line.dropFirst()) else { continue }

        solution += distance / steps
        distance %= steps

        let next = current + (line.first == "L" ? -distance : distance)

        if current != 0 && (next < 0 || next > steps) {
            solution += 1
        }

        current = (next + steps) % steps
        if current == 0 {
            solution += 1
        }
    }

    return "Solution: \(solution)"
}
