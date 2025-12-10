// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "10",
    dependencies: [
        .package(url: "https://github.com/LuizZak/swift-z3.git", branch: "master")
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .executableTarget(
            name: "10",
            dependencies: [
                .product(name: "SwiftZ3", package: "swift-z3")
            ]
        )
    ]
)
