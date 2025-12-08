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

class Coordinate: Hashable {
    let x: Int
    let y: Int
    let z: Int

    init(x: Int, y: Int, z: Int) {
        self.x = x
        self.y = y
        self.z = z
    }

    var description: String {
        return "(\(x), \(y), \(z))"
    }

    // Euclidean distance
    func distance(to other: Coordinate) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        let dz = z - other.z
        return sqrt(Double(dx * dx + dy * dy + dz * dz))
    }

    static func == (lhs: Coordinate, rhs: Coordinate) -> Bool {
        return lhs.x == rhs.x && lhs.y == rhs.y && lhs.z == rhs.z
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(x)
        hasher.combine(y)
        hasher.combine(z)
    }
}

func solve() -> String {
    let input = readInput(at: inputPath)
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    let coords = lines.map { line -> Coordinate in
        let parts = line.split(separator: ",").map { Int($0)! }
        return Coordinate(x: parts[0], y: parts[1], z: parts[2])
    }

    var distancesBetweenCoords: [(distance: Double, coordA: Coordinate, coordB: Coordinate)] = []
    for i in 0..<coords.count {
        for j in (i + 1)..<coords.count {
            let distance = coords[i].distance(to: coords[j])
            distancesBetweenCoords.append(
                (distance: distance, coordA: coords[i], coordB: coords[j]))
        }
    }
    distancesBetweenCoords.sort(by: { $0.distance < $1.distance })

    var solution: Int? = nil
    var circuits: [Set<Coordinate>] = []
    for item in distancesBetweenCoords {
        var foundCircuits: [Set<Coordinate>] = []
        var unconnectedCircuits: [Set<Coordinate>] = []
        var alreadyConnected = false

        for circuit in circuits {
            if circuit.contains(item.coordA) && circuit.contains(item.coordB) {
                alreadyConnected = true
                break
            } else if circuit.contains(item.coordA) || circuit.contains(item.coordB) {
                foundCircuits.append(circuit)
            } else {
                unconnectedCircuits.append(circuit)
            }
        }

        if alreadyConnected {
            continue
        }

        circuits = unconnectedCircuits
        var newCircuit: Set<Coordinate> = [item.coordA, item.coordB]
        if foundCircuits.count == 1 {
            newCircuit.formUnion(foundCircuits.first!)
        } else if !foundCircuits.isEmpty {
            for circuit in foundCircuits {
                newCircuit.formUnion(circuit)
            }
        }
        circuits.append(newCircuit)

        if circuits.first?.count == coords.count {
            solution = item.coordA.x * item.coordB.x
            break
        }
    }

    guard let solution else {
        return "No solution found"
    }

    return "Solution: \(solution)"
}

print(solve())
