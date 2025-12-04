import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    for line in lines {
        let lineLen = line.count
        var nums = Array(repeating: -1, count: 12)

        for (i, char) in line.enumerated() {
            let remaining = lineLen - i - 1
            let num = Int(String(char))!

            for (j, storedNum) in nums.suffix(remaining + 1).enumerated() {
                let offset = max(nums.count - (remaining + 1), 0)
                if num > storedNum {
                    nums[j + offset] = num
                    for k in (j + offset + 1)..<nums.count {
                        nums[k] = -1
                    }
                    break
                }
            }
        }

        var joltage = 0
        for (i, num) in nums.reversed().enumerated() {
            joltage += num * Int(pow(10.0, Double(i)))
        }
        // print(joltage)
        solution += joltage
    }

    return "Solution: \(solution)"
}
