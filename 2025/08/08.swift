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
    let z: Int

    var description: String {
        "(\(x), \(y), \(z))"
    }

    // Euclidean distance
    func distance(to other: Coordinate) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        let dz = z - other.z
        return sqrt(Double(dx * dx + dy * dy + dz * dz))
    }
}

struct Connection {
    let distance: Double
    let coordA: Coordinate
    let coordB: Coordinate
}

func solve() -> String {
    let input = readInput(at: inputPath)
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    let coords = lines.compactMap { line -> Coordinate? in
        let parts = line.split(separator: ",").compactMap { Int($0) }
        guard parts.count == 3 else { return nil }
        return Coordinate(x: parts[0], y: parts[1], z: parts[2])
    }

    var connections: [Connection] = []
    for i in 0..<coords.count {
        for j in (i + 1)..<coords.count {
            let distance = coords[i].distance(to: coords[j])
            connections.append(Connection(distance: distance, coordA: coords[i], coordB: coords[j]))
        }
    }
    connections.sort { $0.distance < $1.distance }

    var circuits: [Set<Coordinate>] = []
    for connection in connections {
        var foundCircuits: [Set<Coordinate>] = []
        var unconnectedCircuits: [Set<Coordinate>] = []
        var alreadyConnected = false

        for circuit in circuits {
            if circuit.contains(connection.coordA) && circuit.contains(connection.coordB) {
                alreadyConnected = true
                break
            } else if circuit.contains(connection.coordA) || circuit.contains(connection.coordB) {
                foundCircuits.append(circuit)
            } else {
                unconnectedCircuits.append(circuit)
            }
        }

        guard !alreadyConnected else { continue }

        var newCircuit: Set<Coordinate> = [connection.coordA, connection.coordB]
        for circuit in foundCircuits {
            newCircuit.formUnion(circuit)
        }
        circuits = unconnectedCircuits + [newCircuit]

        if circuits.first?.count == coords.count {
            return "Solution: \(connection.coordA.x * connection.coordB.x)"
        }
    }

    return "No solution found"
}

print(solve())
