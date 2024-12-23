enum Opcode {
	/**
	 * adv performs division.
	 * The numerator is the value in the A register.
	 * The denominator is found by raising 2 to the power of the instruction's combo operand.
	 * (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.)
	 * The result of the division operation is truncated to an integer and then written to the A register
	 */
	Adv = 0,
	/**
	 * bxl calculates the bitwise XOR of register B and the instruction's literal operand,
	 * then stores the result in register B.
	 */
	Bxl = 1,
	/**
	 * bst calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits),
	 * then writes that value to the B register.
	 */
	Bst = 2,
	/**
	 * jnz does nothing if the A register is 0. However, if the A register is not zero,
	 * it jumps by setting the instruction pointer to the value of its literal operand;
	 * if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
	 */
	Jnz = 3,
	/**
	 * bxc calculates the bitwise XOR of register B and register C, then stores the result in register B.
	 * (For legacy reasons, this instruction reads an operand but ignores it.)
	 */
	Bxc = 4,
	/**
	 * out calculates the value of its combo operand modulo 8, then outputs that value.
	 * (If a program outputs multiple values, they are separated by commas.)
	 */
	Out = 5,
	/**
	 * bdv works exactly like the adv instruction except that the result is stored in the B register.
	 * (The numerator is still read from the A register.)
	 */
	Bdv = 6,
	/**
	 * cdv works exactly like the adv instruction except that the result is stored in the C register.
	 * (The numerator is still read from the A register.)
	 */
	Cdv = 7,
}

enum ComboOperand {
	LiteralZero = 0,
	LiteralOne = 1,
	LiteralTwo = 2,
	LiteralThree = 3,
	RegisterA = 4,
	RegisterB = 5,
	RegisterC = 6,
	Reserved = 7,
}

interface Instruction {
	opcode: Opcode;
	operand: number;
}

interface Registers {
	A: bigint;
	B: bigint;
	C: bigint;
}

function runProgram(instructions: Instruction[], registers: Registers) {
	let out = "";

	function getComboOperandValue(operand: ComboOperand) {
		switch (operand) {
			case ComboOperand.LiteralZero:
			case ComboOperand.LiteralOne:
			case ComboOperand.LiteralTwo:
			case ComboOperand.LiteralThree:
				return BigInt(operand);
			case ComboOperand.RegisterA:
				return registers.A;
			case ComboOperand.RegisterB:
				return registers.B;
			case ComboOperand.RegisterC:
				return registers.C;
			case ComboOperand.Reserved:
				throw new Error("Reserved combo operand shouldn't appear in valid programs");
		}
	}

	let instructionPointer = 0;
	while (instructionPointer < instructions.length) {
		const { opcode, operand } = instructions[instructionPointer];
		if (opcode === Opcode.Adv) {
			registers.A = registers.A / 2n ** getComboOperandValue(operand);
			instructionPointer++;
		} else if (opcode === Opcode.Bxl) {
			registers.B = registers.B ^ BigInt(operand);
			instructionPointer++;
		} else if (opcode === Opcode.Bst) {
			registers.B = getComboOperandValue(operand) % 8n;
			instructionPointer++;
		} else if (opcode === Opcode.Jnz) {
			if (registers.A === 0n) instructionPointer++;
			else instructionPointer = operand;
		} else if (opcode === Opcode.Bxc) {
			registers.B = registers.B ^ registers.C;
			instructionPointer++;
		} else if (opcode === Opcode.Out) {
			out += `,${getComboOperandValue(operand) % 8n}`;
			instructionPointer++;
		} else if (opcode === Opcode.Bdv) {
			registers.B = registers.A / 2n ** getComboOperandValue(operand);
			instructionPointer++;
		} else if (opcode === Opcode.Cdv) {
			registers.C = registers.A / 2n ** getComboOperandValue(operand);
			instructionPointer++;
		}
	}

	return out.slice(1); // get rid of first comma
}

export function solve(input: string): bigint {
	const lines = input.split("\n");

	const registers: Registers = {
		A: BigInt(parseInt(lines[0].slice("Register A: ".length))),
		B: BigInt(parseInt(lines[1].slice("Register B: ".length))),
		C: BigInt(parseInt(lines[2].slice("Register C: ".length))),
	};
	const programOutput = lines[4].slice("Program: ".length);
	const program = programOutput.split(",").map(Number);

	const instructions: Instruction[] = [];
	for (let i = 0; i < program.length; i += 2) {
		const opcode = program[i] as Opcode;
		const operand = program[i + 1];
		instructions.push({ opcode, operand });
	}

	let initialA = 0n;
	for (let pos = program.length - 1; pos >= 0; pos--) {
		initialA *= 8n;

		while (
			runProgram(instructions, { ...registers, A: initialA }) !== program.slice(pos).join(",")
		) {
			initialA++;
		}
	}

	return initialA;
}
