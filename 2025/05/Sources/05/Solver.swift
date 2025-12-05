import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    var distinctRanges: [ClosedRange<Int>] = []
    for line in lines {
        if !line.contains("-") {
            break
        }

        let rangeBounds = line.split(separator: "-").map { Int($0)! }
        let lowerBound = rangeBounds[0]
        let upperBound = rangeBounds[1]
        var range = lowerBound...upperBound

        for existingRange in distinctRanges {
            if existingRange.overlaps(range) {
                let merged =
                    min(
                        existingRange.lowerBound, range.lowerBound)...max(
                        existingRange.upperBound, range.upperBound)
                distinctRanges.removeAll { $0 == existingRange }
                range = merged
            }
        }
        distinctRanges.append(range)
    }

    for range in distinctRanges {
        solution += range.count
    }

    return "Solution: \(solution)"
}
