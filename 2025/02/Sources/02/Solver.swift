import Foundation

public func solve(input: String) -> String {
    let ranges = input.split(separator: ",").map(String.init)
    var solution = 0

    for range in ranges {
        let parts = range.split(separator: "-").map(String.init)
        guard parts.count == 2,
            let start = Int(parts[0]),
            let end = Int(parts[1])
        else {
            print("Invalid range format: \(range)")
            exit(1)
        }

        for number in start...end {
            let numStr = String(number)

            if isRepeatingPattern(numStr) {
                solution += number
            }
        }
    }

    return "Solution: \(solution)"
}

private func isRepeatingPattern(_ str: String) -> Bool {
    guard str.count >= 2 else { return false }
    for divisor in 2...str.count where str.count % divisor == 0 {
        let segmentLength = str.count / divisor
        let segment = String(str.prefix(segmentLength))
        if str == String(repeating: segment, count: divisor) {
            return true
        }
    }
    return false
}
