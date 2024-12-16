// CardLocker.js

// =============================
// Trading Card Data
// Users can edit the data below to customize the trading cards.
// =============================

const data = {
  hpRange: {
    min: 50, max: 150
  },
  costRange: {
    min: 0, max: 4
  },
  energyRangeChampion: {
    min: 2, max: 4
  },
  energyRangeOthers: {
    min: 0, max: 5
  },
  attackRange: {
    min: 10, max: 150
  },
  abilities: [{
      description: "Fireball: Deals extra damage over time.",
      weight: 4,
      pointValue: 2
    },
    {
      description: "Shield: Absorbs incoming attacks for 3 turns.",
      weight: 3,
      pointValue: 3
    },
    {
      description: "Heal: Restores HP by 20 points.",
      weight: 3,
      pointValue: 2
    },
  ],
  typeValues: [{
      value: "Armor",
      weight: 2,
      exclude: ["hp", "attack"],
      extraPoints: 5
    },
    {
      value: "Weapon",
      weight: 2,
      exclude: ["hp"],
      extraPoints: 2
    },
    {
      value: "Accessory",
      weight: 2,
      exclude: ["hp", "attack"],
      extraPoints: 5
    },
    {
      value: "Consumable",
      weight: 2,
      exclude: ["hp", "attack"],
      extraPoints: 5
    },
    {
      value: "Pet",
      weight: 2,
      exclude: [],
      extraPoints: 0
    },
    {
      value: "Champion",
      weight: 2,
      exclude: ["cost"],
      extraPoints: -3
    },
  ],
  roots: ["Flame", "Shadow", "Iron"],
  prefixes: ["Fiery", "Dark", "Mystic"],
  suffixes: ["Destroyer", "Guardian", "Master"],
};

// =============================
// End of Trading Card Data
// =============================

document.addEventListener("DOMContentLoaded", function () {
  const cardNameElement = document.getElementById('card-name');
  const cardTypeElement = document.getElementById('card-type');
  const EcostElement = document.getElementById('card-cost');
  const cardHpElement = document.getElementById('card-hp');
  const cardAttackElement = document.getElementById('card-attack');
  const cardEnergyElement = document.getElementById('card-energy');
  const cardAbilitiesElement = document.getElementById('card-abilities');
  const generateButton = document.getElementById('generate-button');
  const prefixDropdown = document.getElementById('prefix-dropdown');
  const rootDropdown = document.getElementById('root-dropdown');
  const suffixDropdown = document.getElementById('suffix-dropdown');
  const confirmNameButton = document.getElementById('confirm-name-button');
  const renameContainer = document.getElementById('rename-container');

  // Function to pick a random item based on weights
  function pickRandomWeighted(list) {
    const totalWeight = list.reduce(function (acc, item) {
      return acc + (item.weight || 1);
    }, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      random -= item.weight || 1;
      if (random <= 0) {
        return item;
      }
    }
    // In case of rounding errors, return the last item
    return list[list.length - 1];
  }

  // Function to generate numbers with a middle peak probability
  function generateNumberWithMiddlePeakProbability(min, max) {
    const range = [];
    const mid = (min + max) / 2;
    const maxDistance = Math.floor((max - min) / 2);
    for (let i = min; i <= max; i++) {
      const distanceFromMid = Math.abs(i - mid);
      const weight = maxDistance - distanceFromMid + 1;
      range.push({
        value: i,
        weight
      });
    }
    return pickRandomWeighted(range).value;
  }

  // Function to generate numbers with decreasing probability (higher numbers are less likely)
  function generateNumberWithDecreasingProbability(min, max) {
    const range = [];
    for (let i = min; i <= max; i++) {
      range.push({
        value: i,
        weight: (max - i + 1)
      });
    }
    return pickRandomWeighted(range).value;
  }

  // Function to generate HP
  function generateHP() {
    const minHP = data.hpRange.min;
    const maxHP = data.hpRange.max;
    const hpValue = generateNumberWithMiddlePeakProbability(minHP, maxHP);
    let pointValue;
    if (hpValue <= 70) {
      pointValue = 1;
    } else if (hpValue <= 110) {
      pointValue = 2;
    } else {
      pointValue = 3;
    }
    return {
      hp: hpValue,
      pointValue
    };
  }

  // Function to generate Cost
  function generateCost() {
    const minCost = data.costRange.min;
    const maxCost = data.costRange.max;
    const cost = generateNumberWithMiddlePeakProbability(minCost, maxCost);
    const pointValue = 4 - cost * 2; // Cost of 0: +4 points, Cost of 4: -4 points
    return {
      cost,
      pointValue
    };
  }

  // Function to generate Energy
  function generateEnergy(isChampion) {
    let energyValue, pointValue;

    // Function to replace manual weight-based generation with exponential decay
    function generateNumberWithExponentialProbability(minEnergy, maxEnergy) {
      return Math.floor(generateBiasedRandom(minEnergy, maxEnergy));
    }

    if (isChampion) {
      const minEnergy = data.energyRangeChampion.min;
      const maxEnergy = data.energyRangeChampion.max;
      energyValue = generateNumberWithExponentialProbability(minEnergy, maxEnergy);
    } else {
      const minEnergy = data.energyRangeOthers.min;
      const maxEnergy = data.energyRangeOthers.max;
      energyValue = generateNumberWithExponentialProbability(minEnergy, maxEnergy);
    }

    pointValue = energyValue;
    return {
      energy: energyValue,
      pointValue
    };
  }

  // Generates a number between a and b based on a curve.
  function generateBiasedRandom(a, b) {
    const c = a + 0.2 * (b - a); // Calculate c as 20% of the way between a and b
    const targetProbability = 0.7; // Probability that x lies between a and c

    // Solve for k using the probability condition
    const k = -Math.log(1 - targetProbability) / (c - a);

    // Generate a random number biased towards a
    const u = Math.random(); // Uniform random number between 0 and 1
    const x = a - (1 / k) * Math.log(1 - u * (1 - Math.exp(-k * (b - a))));

    return x;
  }


  // Function to generate Attack
  function generateAttack() {
    const minAttack = data.attackRange.min;
    const maxAttack = data.attackRange.max;
    const attackValue = generateNumberWithMiddlePeakProbability(minAttack, maxAttack);
    let pointValue;
    if (attackValue <= 30) {
      pointValue = 1;
    } else if (attackValue <= 60) {
      pointValue = 2;
    } else {
      pointValue = 3;
    }
    return {
      attack: attackValue,
      pointValue
    };
  }

  // Function to generate Ability
  function generateAbility() {
    const abilityItem = pickRandomWeighted(data.abilities);
    return {
      description: abilityItem.description,
      pointValue: abilityItem.pointValue
    };
  }

  // Function to generate the Card
  function generateCard() {
    // First, unhide all elements
    cardHpElement.style.display = '';
    cardAttackElement.style.display = '';
    EcostElement.style.display = '';
    cardEnergyElement.style.display = '';

    // Pick a random type
    const tcgtypeItem = pickRandomWeighted(data.typeValues);
    const tcgtype = tcgtypeItem.value;
    const excludedAttributes = tcgtypeItem.exclude || [];
    const extraPoints = tcgtypeItem.extraPoints || 0;
    const isChampion = tcgtype === "Champion";

    let totalPointValue = 0;
    let hpResult, hp, hpPointValue;
    let costResult, cost, costPointValue;
    let energyResult, energy, energyPointValue;
    let attackResult, attack, attackPointValue;
    let abilityResult, abilityDescription, abilityPointValue;

    do {
      totalPointValue = extraPoints;

      // Generate Ability
      abilityResult = generateAbility();
      abilityDescription = abilityResult.description;
      abilityPointValue = abilityResult.pointValue;
      totalPointValue += abilityPointValue;

      // Generate Cost (if not excluded)
      if (!excludedAttributes.includes('cost')) {
        costResult = generateCost();
        cost = costResult.cost;
        costPointValue = costResult.pointValue;
        totalPointValue += costPointValue;
      } else {
        cost = null;
      }

      // Generate HP (if not excluded)
      if (!excludedAttributes.includes('hp')) {
        hpResult = generateHP();
        hp = hpResult.hp;
        hpPointValue = hpResult.pointValue;
        totalPointValue += hpPointValue;
      } else {
        hp = null;
      }

      // Generate Attack (if not excluded)
      if (!excludedAttributes.includes('attack')) {
        attackResult = generateAttack();
        attack = attackResult.attack;
        attackPointValue = attackResult.pointValue;
        totalPointValue += attackPointValue;
      } else {
        attack = null;
      }

      // Generate Energy
      energyResult = generateEnergy(isChampion);
      energy = energyResult.energy;
      energyPointValue = energyResult.pointValue;
      totalPointValue += energyPointValue;

      // No longer need to subtract points for Champions here
      // as extraPoints is set to -3 directly in typeValues

    } while (totalPointValue < 7 || totalPointValue > 10); // Ensures balanced cards

    // Set the card elements
    cardTypeElement.textContent = `${tcgtype}`;
    cardAbilitiesElement.textContent = abilityDescription;

    if (cost !== null) {
      EcostElement.textContent = `${cost}`;
      EcostElement.style.display = '';
    } else {
      EcostElement.style.display = 'none';
    }

    if (hp !== null) {
      cardHpElement.textContent = `HP: ${hp}`;
      cardHpElement.style.display = '';
    } else {
      cardHpElement.style.display = 'none';
    }

    if (attack !== null) {
      cardAttackElement.textContent = `Attack: ${attack}`;
      cardAttackElement.style.display = '';
    } else {
      cardAttackElement.style.display = 'none';
    }

    if (energy !== 0) {
      cardEnergyElement.textContent = `Energy: ${energy}`;
      cardEnergyElement.style.display = '';
    } else {
      cardEnergyElement.textContent = '';
      cardEnergyElement.style.display = 'none';
    }

    generateCardNameOptions();
  }

  // Function to generate Card Name Options
  function generateCardNameOptions() {
    const prefixes = shuffleArray(data.prefixes);
    const roots = shuffleArray(data.roots);
    const suffixes = shuffleArray(data.suffixes);

    populateDropdown(prefixDropdown, prefixes, true);
    populateDropdown(rootDropdown, roots, false);
    populateDropdown(suffixDropdown, suffixes, true);

    renameContainer.style.display = 'block';
  }

  // Function to populate dropdowns
  function populateDropdown(dropdown, options, allowBlank) {
    dropdown.innerHTML = '';
    if (allowBlank) {
      const blankOption = document.createElement('option');
      blankOption.value = '';
      blankOption.textContent = 'None';
      dropdown.appendChild(blankOption);
    }
    options.forEach(function (option) {
      const optElement = document.createElement('option');
      optElement.value = option;
      optElement.textContent = option;
      dropdown.appendChild(optElement);
    });
  }

  // Function to shuffle an array
  function shuffleArray(array) {
    return array.slice().sort(function () {
      return Math.random() - 0.5;
    });
  }

  // Event listener for confirming the card name
  confirmNameButton.addEventListener('click', function () {
    const chosenPrefix = prefixDropdown.value;
    const chosenRoot = rootDropdown.value;
    const chosenSuffix = suffixDropdown.value;

    const nameParts = [chosenPrefix, chosenRoot, chosenSuffix].filter(function (part) {
      return part;
    });
    cardNameElement.textContent = nameParts.join(' ');

    renameContainer.style.display = 'none';
  });

  // Event listener for generating a new card
  generateButton.addEventListener('click', function () {
    generateCard();
  });
});
