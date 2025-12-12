import Foundation

let inputPath = "input.txt"

func readInput(at path: String) -> String {
    let url = URL(fileURLWithPath: path)
    guard let contents = try? String(contentsOf: url, encoding: .utf8) else {
        fatalError("Failed to read \(path)")
    }
    return contents
}

struct Shape {
    let id: Int
    let grid: [[Bool]]

    var cellCount: Int {
        grid.flatMap { $0 }.filter { $0 }.count
    }
}

struct Container {
    let width: Int
    let height: Int
    let shapeCounts: [(shapeId: Int, count: Int)]
}

struct PuzzleInput {
    let shapes: [Shape]
    let containers: [Container]
}

func parseInput(_ input: String) -> PuzzleInput {
    let blocks = input.split(separator: "\n\n").map { String($0) }

    // All blocks except last are shapes
    let shapes = blocks.dropLast().enumerated().map { (id, block) -> Shape in
        let grid = block.split(separator: "\n")
            .dropFirst()  // Skip "0:" line
            .map { line in line.map { $0 == "#" } }
        return Shape(id: id, grid: grid)
    }

    // Last block contains all containers
    let containers =
        blocks.last?.split(separator: "\n").compactMap { line -> Container? in
            let parts = line.split(separator: ":")
            let dimensions = parts[0].split(separator: "x")

            guard dimensions.count == 2,
                let width = Int(dimensions[0]),
                let height = Int(dimensions[1])
            else {
                return nil
            }

            let counts = parts[1]
                .trimmingCharacters(in: .whitespaces)
                .split(separator: " ")
                .compactMap { Int($0) }

            // Index = shapeId, value = count
            let shapeCounts = counts.enumerated()
                .filter { $0.1 > 0 }
                .map { ($0.0, $0.1) }

            return Container(width: width, height: height, shapeCounts: shapeCounts)
        } ?? []

    return PuzzleInput(shapes: shapes, containers: containers)
}

func solve() -> Int {
    let input = readInput(at: inputPath)
    let puzzle = parseInput(input)

    return puzzle.containers.filter { container in
        let containerArea = container.width * container.height
        var totalShapeArea = 0

        for (shapeId, count) in container.shapeCounts {
            guard let shape = puzzle.shapes.first(where: { $0.id == shapeId }) else {
                return false
            }
            totalShapeArea += shape.cellCount * count
            if totalShapeArea > containerArea {
                return false
            }
        }

        return totalShapeArea <= containerArea
    }.count
}

print("Solution: \(solve())")
