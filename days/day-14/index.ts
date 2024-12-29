import * as path from "jsr:@std/path";

import { readLines } from "../../utils.ts";
import { Xy } from "../../utils/geometry/xy.ts";
import { Range } from "../../utils/range/range.ts";

export function solveDay14(filename: string) {
  const fullPath = path.join(import.meta.dirname ?? "", filename);

  const lines = readLines(fullPath);
  const input = parseInput(lines);

  console.log(`The solution to part 1 is: ${solvePart1(input)}`);
  console.log(`The solution to part 2 is: ${solvePart2(input)}`);
}

type Box = {
  width: number;
  height: number;
};

type Input = {
  robots: ReadonlyArray<Robot>;
  box: Box;
};

type Robot = {
  position: Xy;
  velocity: Xy;
};

const digit = new RegExp(/-?\d+/g);

function parseInput(lines: ReadonlyArray<string>): Input {
  const robots = lines.map((l): Robot => {
    const digits = [...l.matchAll(digit)].map((d) => parseInt(d[0]));

    return {
      position: new Xy(digits[0], digits[1]),
      velocity: new Xy(digits[2], digits[3]),
    };
  });

  return {
    robots,
    box: {
      width: 101,
      height: 103,
    },
  };
}

function solvePart1(input: Input): number {
  const initial: State = { robots: input.robots, steps: 0 };
  const done = runSteps(initial, input.box, 100);

  return getSafetyFactor(done, input.box);
}

function solvePart2(input: Input): number {
  let state: State = { robots: input.robots, steps: 0 };

  while (true) {
    state = step(state, input.box);

    if (countTouching(state) >= input.robots.length * 0.9) {
      writeState(state, input.box);

      return state.steps;
    }
  }
}

type State = {
  robots: ReadonlyArray<Robot>;
  steps: number;
};

function runSteps(state: State, box: Box, steps: number): State {
  let result = { ...state };

  while (result.steps < steps) {
    result = step(result, box);
  }

  return result;
}

function step(state: State, box: Box): State {
  return {
    robots: state.robots.map((r) => stepRobot(r, box)),
    steps: state.steps + 1,
  };
}

function stepRobot(robot: Robot, box: Box): Robot {
  const x = mod(robot.position.x + robot.velocity.x, box.width);
  const y = mod(robot.position.y + robot.velocity.y, box.height);

  const position = new Xy(x, y);

  return { ...robot, position };
}

function getSafetyFactor(state: State, box: Box): number {
  const counts = getQuadrants(box).map((q) => countInQuadrant(state.robots, q));

  return counts.reduce((prod, n) => prod * n);
}

function countInQuadrant(
  robots: ReadonlyArray<Robot>,
  quadrant: Quadrant
): number {
  return robots.filter((r) => isInQuadrant(r, quadrant)).length;
}

function isInQuadrant(robot: Robot, quadrant: Quadrant): boolean {
  const x = new Range(quadrant[0].x, quadrant[1].x);
  const y = new Range(quadrant[0].y, quadrant[1].y);

  return x.contains(robot.position.x) && y.contains(robot.position.y);
}

type Quadrant = [Xy, Xy];

function getQuadrants(box: Box): ReadonlyArray<Quadrant> {
  const q1: Quadrant = [
    new Xy(0, 0),
    new Xy(Math.floor(box.width / 2) - 1, Math.floor(box.height / 2) - 1),
  ];

  const q2: Quadrant = [new Xy(q1[1].x + 2, 0), new Xy(box.width, q1[1].y)];
  const q3: Quadrant = [new Xy(0, q1[1].y + 2), new Xy(q1[1].x, box.height)];
  const q4: Quadrant = [
    new Xy(q1[1].x + 2, q1[1].y + 2),
    new Xy(box.width, box.height),
  ];

  return [q1, q2, q3, q4];
}

function countTouching(state: State): number {
  return state.robots
    .map(
      (r1, i) =>
        state.robots.filter(
          (r2, j) =>
            i !== j && r1.position.subtract(r2.position).magnitude === 1
        ).length
    )
    .reduce((sum, n) => sum + n, 0);
}

function mod(n: number, m: number): number {
  if (n < 0) {
    return (m + n) % m;
  } else {
    return n % m;
  }
}

function writeState(state: State, box: Box): void {
  let result: string = "";

  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const position = new Xy(x, y);
      const n = state.robots.filter((r) => r.position.equals(position)).length;

      if (n === 0) {
        result += ".";
      } else {
        result += Math.min(n, 9);
      }
    }

    result += "\n";
  }

  console.log(`After ${state.steps} seconds:`);
  console.log(result);
}
