import Foundation

// let inputPath = "input.example.txt"
let inputPath = "input.txt"

func readInput(at path: String) -> String {
    do {
        let url = URL(fileURLWithPath: path)
        return try String(contentsOf: url, encoding: .utf8)
    } catch {
        fputs("Error: Failed to read \(path): \(error)\n", stderr)
        exit(1)
    }
}

struct Coordinate: Hashable {
    let x: Int
    let y: Int

    var description: String {
        "(\(x), \(y))"
    }
}

struct Rectangle {
    let corner1: Coordinate
    let corner2: Coordinate

    var area: Int {
        let dx = corner1.x - corner2.x + 1
        let dy = corner1.y - corner2.y + 1
        return abs(dx * dy)
    }
}

func solve() -> String {
    let input = readInput(at: inputPath)
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    let coords = lines.compactMap { line -> Coordinate? in
        let parts = line.split(separator: ",").compactMap { Int($0) }
        guard parts.count == 2 else { return nil }
        return Coordinate(x: parts[0], y: parts[1])
    }

    var currentLargest: Rectangle? = nil
    for i in 0..<coords.count {
        for j in (i + 1)..<coords.count {
            let rect = Rectangle(corner1: coords[i], corner2: coords[j])

            if let largest = currentLargest {
                if rect.area > largest.area {
                    currentLargest = rect
                }
            } else {
                currentLargest = rect
            }
        }
    }

    guard let solution = currentLargest?.area else {
        return "No rectangles found"
    }

    return "Solution: \(solution)"
}

print(solve())
