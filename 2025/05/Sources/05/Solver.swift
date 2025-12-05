import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    var freshRanges: [ClosedRange<Int>] = []
    for line in lines {
        if line.contains("-") {
            let rangeBounds = line.split(separator: "-").map { Int($0)! }
            let range = rangeBounds[0]...rangeBounds[1]
            freshRanges.append(range)
        } else {
            let ingredientId = Int(line)!
            if freshRanges.contains(where: { $0.contains(ingredientId) }) {
                solution += 1
            }
        }
    }

    return "Solution: \(solution)"
}
