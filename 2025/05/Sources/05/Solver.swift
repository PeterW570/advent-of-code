import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)

    var distinctRanges: [ClosedRange<Int>] = []

    for line in lines {
        guard line.contains("-") else { break }

        let bounds = line.split(separator: "-").compactMap { Int($0) }
        guard bounds.count == 2 else { continue }

        var range = bounds[0]...bounds[1]

        distinctRanges = distinctRanges.filter { existingRange in
            if existingRange.overlaps(range) {
                range =
                    min(
                        existingRange.lowerBound, range.lowerBound)...max(
                        existingRange.upperBound, range.upperBound)
                return false
            }
            return true
        }

        distinctRanges.append(range)
    }

    let solution = distinctRanges.reduce(0) { $0 + $1.count }

    return "Solution: \(solution)"
}
