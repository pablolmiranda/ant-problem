const inputs = ['>.......', '.......<', '.>>...<<.', '+++++++'];

const DIRECTION = {
  RIGHT: 1,
  LEFT: -1
};

/**
 * Ant actor
 */
class Ant {
  constructor(index, walkDirection) {
    this.index = index;
    this.direction = walkDirection;
  }
}

/**
 * Walk through the input and create the
 * correspondent ant actors for the
 * simulation
 * @param {string} input
 */
function createAntActors(input) {
  ants = [];
  for (let charIndex = 0; charIndex < input.length; charIndex++) {
    const char = input[charIndex];
    if (char === '.') {
      continue;
    } else if (char === '>') {
      ants.push(new Ant(charIndex, DIRECTION.RIGHT));
    } else if (char === '<') {
      ants.push(new Ant(charIndex, DIRECTION.LEFT));
    } else if (char === '+') {
      ants.push(new Ant(charIndex, DIRECTION.RIGHT));
      ants.push(new Ant(charIndex, DIRECTION.LEFT));
    }
  }
  return ants;
}

/**
 * Build a new empty terrain
 * Ex.: length 7 => .......
 * @param {number} length
 */
function buildNewTerrain(length) {
  return Array(length).fill('.');
}

/**
 * Loop through the ant collection and:
 *  - Update the index for each ant
 *  - Remove any ant which fall out of the
 *    terrain
 * @param {Ant[]} ants
 * @param {number} length
 */
function updateAntsIndex(ants, length) {
  return ants.reduce((nextAnts, ant) => {
    let index = ant.index;
    index = ant.direction === DIRECTION.RIGHT ? index + 1 : index - 1;
    if (index < 0 || index >= length) {
      return nextAnts;
    }
    ant.index = index;
    nextAnts.push(ant);
    return nextAnts;
  }, []);
}

/**
 * Collect all the updates necessary to the
 * terrain based on the number of existent
 * ants
 * @param {Ant[]} ants
 */
function calculateTerrainUpdate(ants) {
  const indexMap = {};
  ants.forEach(ant => {
    const index = ant.index;
    if (!indexMap[index]) {
      indexMap[index] = {
        ants: 0,
        direction: ant.direction
      };
    }
    indexMap[index].ants++;
  });

  return indexMap;
}

/**
 * Assign the correct symbols to the terrain:
 *  - '>': ant walking to right
 *  - '<': ant walking to left
 *  - '+': one ant over another
 * @param {string[]} terrain
 * @param {[index: number]: {ants:number, direction: number}}} updateToApply
 */
function updateTerrain(terrain, updateToApply = {}) {
  Object.keys(updateToApply).forEach(index => {
    const update = updateToApply[index];
    const numberOfAnts = update.ants;
    const direction = update.direction;
    if (numberOfAnts === 1) {
      if (direction === DIRECTION.LEFT) {
        terrain[index] = '<';
      } else {
        terrain[index] = '>';
      }
    } else if (numberOfAnts === 2) {
      terrain[index] = '+';
    }
  });

  return terrain;
}

/**
 * Solve the ant walk problem.
 *
 */
function solve(input) {
  let ants = createAntActors(input);
  const length = input.length;
  while (ants.length > 0) {
    console.log(input);
    input = buildNewTerrain(length);
    ants = updateAntsIndex(ants, length);
    const terrainUpdate = calculateTerrainUpdate(ants);
    input = updateTerrain(input, terrainUpdate).join('');
  }
}

inputs.forEach(solve);
