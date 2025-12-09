import Foundation

let isExample = CommandLine.arguments.contains("--example")
let inputPath = "input\(isExample ? ".example" : "").txt"

func readInput(at path: String) -> String {
    do {
        let url = URL(fileURLWithPath: path)
        return try String(contentsOf: url, encoding: .utf8)
    } catch {
        fputs("Error: Failed to read \(path): \(error)\n", stderr)
        exit(1)
    }
}

struct Point {
    let x: Int
    let y: Int

    func areaWith(_ other: Point) -> Int {
        (abs(x - other.x) + 1) * (abs(y - other.y) + 1)
    }
}

struct Edge {
    let a: Point
    let b: Point

    func intersectsRect(_ rectA: Point, _ rectB: Point) -> Bool {
        let rectMinX = min(rectA.x, rectB.x) + 1
        let rectMaxX = max(rectA.x, rectB.x) - 1
        let rectMinY = min(rectA.y, rectB.y) + 1
        let rectMaxY = max(rectA.y, rectB.y) - 1

        let edgeMinX = min(a.x, b.x)
        let edgeMaxX = max(a.x, b.x)
        let edgeMinY = min(a.y, b.y)
        let edgeMaxY = max(a.y, b.y)

        return !(edgeMaxX < rectMinX || edgeMinX > rectMaxX || edgeMaxY < rectMinY || edgeMinY > rectMaxY)
    }
}

func solve() -> String {
    let input = readInput(at: inputPath)
    let corners = input
        .split(whereSeparator: \.isNewline)
        .compactMap { line -> Point? in
            let parts = line.split(separator: ",").compactMap { Int(String($0)) }
            guard parts.count == 2 else { return nil }
            return Point(x: parts[0], y: parts[1])
        }

    let edges = (0..<corners.count - 1).map { Edge(a: corners[$0], b: corners[$0 + 1]) }
        + [Edge(a: corners.last!, b: corners[0])]

    let pairs = (0..<corners.count - 1)
        .flatMap { i in (i + 1..<corners.count).map { j in (i, j) } }

    let validPairs = pairs.filter { i, j in !edges.contains { $0.intersectsRect(corners[i], corners[j]) } }

    let maxArea = validPairs
        .map { corners[$0].areaWith(corners[$1]) }
        .max() ?? 0

    return "Solution: \(maxArea)"
}

print(solve())
