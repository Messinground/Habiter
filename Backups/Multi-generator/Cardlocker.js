// CardLocker.js

// =============================
// Trading Card Data Configuration
// Users can edit the data below to customize the trading cards.
// =============================

const cardData = {
  hpRange: { min: 25, max: 40 },
  costRange: { min: 0, max: 4 },
  energyRange: {
    champion: { min: 2, max: 4 },
    others: { min: 0, max: 5 },
  },
  attackRange: { min: 3, max: 12 },
  abilities: [
    { description: "2⚡ Combust: Deal 5 damage.", weight: 1, pointValue: 2 }, // the ⚡ indicates that it costs 2 energy to use.
    { description: "Your champion takes -1 damage from attacks. Lasts as long as this card is active, or until the start of your next turn.", weight: 1, pointValue: 1 }, // If on a consumable, works until the start of the next turn. Otherwise, works as long as the card is active. This is important to clarify for abilities that aren't neccesarily one-time effects because it may appear on multiple types of cards. It's also important to clarify that the champion is the one taking reduced damage because this may appear on or with a pet.
    { description: "1⚡ Heal 5 HP.", weight: 1, pointValue: 2 }, // Costs 1 energy to use
  ],
  types: [
    { value: "Armor", weight: 3, exclude: ["attack"], extraPoints: 2 },
    { value: "Weapon", weight: 2, exclude: ["hp"], extraPoints: 2 },
    { value: "Consumable", weight: 3, exclude: ["hp", "attack"], extraPoints: 4 },
    { value: "Pet", weight: 2, exclude: [], extraPoints: 0 },
    { value: "Champion", weight: 1, exclude: ["cost"], extraPoints: -3 },
  ],
  naming: {
    roots: [
      "Flame", "Shadow", "Iron", "Storm", "Frost", "Earth", "Light", "Thunder",
      "Void", "Crystal", "Night", "Dawn", "Spirit", "Steel", "Ember", "Venom",
      "Wind", "Stone", "Celestial", "Obsidian",
    ],
    prefixes: [
      "Fiery", "Dark", "Mystic", "Blazing", "Shadowy", "Arcane", "Eternal",
      "Storm", "Frost", "Ancient", "Celestial", "Vengeful", "Radiant",
      "Divine", "Ghostly", "Thunderous", "Luminous", "Spectral", "Sacred",
      "Enchanted",
    ],
    suffixes: [
      "Destroyer", "Guardian", "Master", "Slayer", "Warrior", "Keeper",
      "Savior", "Warden", "Conqueror", "Champion", "Seeker", "Avenger",
      "Protector", "Ruler", "Reaper", "Invoker", "Harbinger", "Sentinel",
      "Bane", "Lord",
    ],
  },
};


// Point values are assigned to each stat based on how strong it is. Values range from 1-3 for each stat.
// Thus each card adds points for attack, HP, energy, and abilities; then subtracts points based on cost. Combinations range from 0-9
// To keep the game balanced, it checks to make sure point totals end up between 7-10. If it does not, it rerolls the card.
// Not all types of cards use every stat, so each type has a parameter to specify what stats are excluded
// If a stat is excluded, the type also has a parameter to specify how much should be added to the Total point calculation to compensate

// ======================================
// End of Trading Card Data Configuration
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // DOM Element References
  const cardContainer = document.getElementById("card-container");
  const generateButton = document.getElementById("generate-button");
  const generatePackButton = document.getElementById("generate-pack-button");
  const renameSelectedButton = document.getElementById("rename-selected-button");
  const renameModal = document.getElementById("rename-modal");
  const closeButton = document.querySelector(".close-button");
  const prefixDropdown = document.getElementById("prefix-dropdown");
  const rootDropdown = document.getElementById("root-dropdown");
  const suffixDropdown = document.getElementById("suffix-dropdown");
  const confirmNameButton = document.getElementById("confirm-name-button");

  let selectedCard = null; // Reference to the card being renamed

  // Helper function to get N unique random elements from an array
  const getRandomElements = (arr, n) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
  };

  // Function to pick a random item based on weights
  const pickRandomWeighted = (list) => {
    const totalWeight = list.reduce((acc, item) => acc + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const item of list) {
      random -= item.weight || 1;
      if (random <= 0) return item;
    }
    return list[list.length - 1]; // Fallback
  };

  // Function to generate a number with a peak probability at the middle
  const generateMiddlePeakNumber = (min, max) => {
    const mid = (min + max) / 2;
    const maxDistance = Math.floor((max - min) / 2);
    const range = Array.from({ length: max - min + 1 }, (_, i) => {
      const value = min + i;
      const distance = Math.abs(value - mid);
      return { value, weight: maxDistance - distance + 1 };
    });
    return pickRandomWeighted(range).value;
  };

  // Function to generate a number with decreasing probability towards higher values
  const generateDecreasingProbabilityNumber = (min, max) => {
    const range = Array.from({ length: max - min + 1 }, (_, i) => ({
      value: min + i,
      weight: max - (min + i) + 1,
    }));
    return pickRandomWeighted(range).value;
  };

// =================================================
// Calculating the power of randomly chosen stats
// =================================================

	
// Function to generate HP
const generateHP = () => {
  const { min, max } = cardData.hpRange;
  const hp = generateMiddlePeakNumber(min, max);
  
  // Calculate dynamic thresholds
  const range = max - min;
  const firstThreshold = min + range * 0.2; 
  const secondThreshold = min + range * 0.6; 
  
  // Determine pointValue based on dynamic thresholds
  let pointValue;
  if (hp <= firstThreshold) {
    pointValue = 1;
  } else if (hp <= secondThreshold) {
    pointValue = 2;
  } else {
    pointValue = 3;
  }
  
  return { hp, pointValue };
};


  // Function to generate Cost
  const generateCost = () => {
    const { min, max } = cardData.costRange;
    const cost = generateMiddlePeakNumber(min, max);
    const pointValue = max - cost * 2; // Cost of 0: +4 points, Cost of 4: -4 points
    return { cost, pointValue };
  };

  // Function to generate Energy
  const generateEnergy = (isChampion) => {
    const { min, max } = isChampion
      ? cardData.energyRange.champion
      : cardData.energyRange.others;

    const energy = Math.floor(generateBiasedRandom(min, max));
    const pointValue = energy;
    return { energy, pointValue };
  };

  // Generates a biased random number between a and b using exponential decay
  const generateBiasedRandom = (a, b) => {
    const c = a + 0.2 * (b - a);
    const targetProbability = 0.7;
    const k = -Math.log(1 - targetProbability) / (c - a);
    const u = Math.random();
    return a - (1 / k) * Math.log(1 - u * (1 - Math.exp(-k * (b - a))));
  };

// Function to generate Attack
const generateAttack = () => {
  const { min, max } = cardData.attackRange;
  const attack = generateMiddlePeakNumber(min, max);
  
  // Calculate dynamic thresholds
  const range = max - min;
  const firstThreshold = min + range * 0.2;
  const secondThreshold = min + range * 0.6; 
  
  // Determine pointValue based on dynamic thresholds
  let pointValue;
  if (attack <= firstThreshold) {
    pointValue = 1;
  } else if (attack <= secondThreshold) {
    pointValue = 2;
  } else {
    pointValue = 3;
  }
  
  return { attack, pointValue };
};

  // Function to generate Ability
  const generateAbility = () => {
    const ability = pickRandomWeighted(cardData.abilities);
    return { description: ability.description, pointValue: ability.pointValue };
  };

  // Function to create a new card DOM element
  const createCardElement = () => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <h2 class="card-name">[Card Name]</h2>
      <div class="card-stats">
        <p class="card-type">[Type]</p>
        <p class="card-cost">[Cost]</p>
      </div>
      <img class="card-art" src="placeholder.jpg" alt="Card Art">
      <div class="card-stats">
        <p class="card-hp">HP: [HP]</p>
        <p class="card-attack">Attack: [Attack Power]</p>
      </div>
      <p class="card-abilities">[Abilities Description]</p>
      <p class="card-energy">Energy: [Energy]</p>
    `;
    card.addEventListener("click", () => toggleCardSelection(card));
    return card;
  };

  // Function to generate a single card
  const generateCard = () => {
    const card = createCardElement();

    // Extract card elements for easy access
    const elements = {
      type: card.querySelector(".card-type"),
      cost: card.querySelector(".card-cost"),
      hp: card.querySelector(".card-hp"),
      attack: card.querySelector(".card-attack"),
      abilities: card.querySelector(".card-abilities"),
      energy: card.querySelector(".card-energy"),
      name: card.querySelector(".card-name"),
    };

    // Randomly select a type based on weights
    const typeItem = pickRandomWeighted(cardData.types);
    const { value: type, exclude, extraPoints } = typeItem;
    const isChampion = type === "Champion";

    let totalPoints;

    let attributes = {};

    do {
      totalPoints = extraPoints;

      // Generate Ability
      const ability = generateAbility();
      attributes.ability = ability.description;
      totalPoints += ability.pointValue;

      // Generate Cost
      if (!exclude.includes("cost")) {
        const cost = generateCost();
        attributes.cost = cost.cost;
        totalPoints += cost.pointValue;
      } else {
        attributes.cost = null;
      }

      // Generate HP
      if (!exclude.includes("hp")) {
        const hp = generateHP();
        attributes.hp = hp.hp;
        totalPoints += hp.pointValue;
      } else {
        attributes.hp = null;
      }

      // Generate Attack
      if (!exclude.includes("attack")) {
        const attack = generateAttack();
        attributes.attack = attack.attack;
        totalPoints += attack.pointValue;
      } else {
        attributes.attack = null;
      }

      // Generate Energy
      const energy = generateEnergy(isChampion);
      attributes.energy = energy.energy;
      totalPoints += energy.pointValue;

    } while (totalPoints < 7 || totalPoints > 10); // Ensure balanced points

    // Populate card elements
    elements.type.textContent = type;
    elements.abilities.textContent = attributes.ability;

    if (attributes.cost !== null) {
      elements.cost.textContent = `Cost: ${attributes.cost}`;
      elements.cost.style.display = "";
    } else {
      elements.cost.style.display = "none";
    }

    if (attributes.hp !== null) {
      elements.hp.textContent = `HP: ${attributes.hp}`;
      elements.hp.style.display = "";
    } else {
      elements.hp.style.display = "none";
    }

    if (attributes.attack !== null) {
      elements.attack.textContent = `Attack: ${attributes.attack}`;
      elements.attack.style.display = "";
    } else {
      elements.attack.style.display = "none";
    }

    if (attributes.energy !== 0) {
      elements.energy.textContent = `Energy: ${attributes.energy}`;
      elements.energy.style.display = "";
    } else {
      elements.energy.textContent = "";
      elements.energy.style.display = "none";
    }

    // Generate naming options
    const [prefixOptions, rootOptions, suffixOptions] = [
      getRandomElements(cardData.naming.prefixes, 3),
      getRandomElements(cardData.naming.roots, 3),
      getRandomElements(cardData.naming.suffixes, 3),
    ];

    // Store naming options in dataset for later use
    card.dataset.prefixOptions = JSON.stringify(prefixOptions);
    card.dataset.rootOptions = JSON.stringify(rootOptions);
    card.dataset.suffixOptions = JSON.stringify(suffixOptions);

    // Set default name
    const defaultName = [
      prefixOptions[Math.floor(Math.random() * prefixOptions.length)],
      rootOptions[Math.floor(Math.random() * rootOptions.length)],
      suffixOptions[Math.floor(Math.random() * suffixOptions.length)],
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    elements.name.textContent = defaultName;

    // Append card to container
    cardContainer.appendChild(card);
  };

  // Function to generate multiple cards (pack)
  const generatePack = (count = 5) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const card = createCardElement();
      fragment.appendChild(card);
    }
    cardContainer.appendChild(fragment);

    // After appending, generate attributes for each new card
    const newCards = cardContainer.querySelectorAll(".card:not([data-generated])");
    newCards.forEach((card) => {
      card.dataset.generated = "true";
      generateCardAttributes(card);
    });
  };

  // Function to generate attributes for a given card element
  const generateCardAttributes = (card) => {
    // Extract card elements for easy access
    const elements = {
      type: card.querySelector(".card-type"),
      cost: card.querySelector(".card-cost"),
      hp: card.querySelector(".card-hp"),
      attack: card.querySelector(".card-attack"),
      abilities: card.querySelector(".card-abilities"),
      energy: card.querySelector(".card-energy"),
      name: card.querySelector(".card-name"),
    };

    // Randomly select a type based on weights
    const typeItem = pickRandomWeighted(cardData.types);
    const { value: type, exclude, extraPoints } = typeItem;
    const isChampion = type === "Champion";

    let totalPoints;
    let attributes = {};

    do {
      totalPoints = extraPoints;

      // Generate Ability
      const ability = generateAbility();
      attributes.ability = ability.description;
      totalPoints += ability.pointValue;

      // Generate Cost
      if (!exclude.includes("cost")) {
        const cost = generateCost();
        attributes.cost = cost.cost;
        totalPoints += cost.pointValue;
      } else {
        attributes.cost = null;
      }

      // Generate HP
      if (!exclude.includes("hp")) {
        const hp = generateHP();
        attributes.hp = hp.hp;
        totalPoints += hp.pointValue;
      } else {
        attributes.hp = null;
      }

      // Generate Attack
      if (!exclude.includes("attack")) {
        const attack = generateAttack();
        attributes.attack = attack.attack;
        totalPoints += attack.pointValue;
      } else {
        attributes.attack = null;
      }

      // Generate Energy
      const energy = generateEnergy(isChampion);
      attributes.energy = energy.energy;
      totalPoints += energy.pointValue;

    } while (totalPoints < 7 || totalPoints > 10); // Ensure balanced points

    // Populate card elements
    elements.type.textContent = type;
    elements.abilities.textContent = attributes.ability;

    if (attributes.cost !== null) {
      elements.cost.textContent = `Cost: ${attributes.cost}`;
      elements.cost.style.display = "";
    } else {
      elements.cost.style.display = "none";
    }

    if (attributes.hp !== null) {
      elements.hp.textContent = `HP: ${attributes.hp}`;
      elements.hp.style.display = "";
    } else {
      elements.hp.style.display = "none";
    }

    if (attributes.attack !== null) {
      elements.attack.textContent = `Attack: ${attributes.attack}`;
      elements.attack.style.display = "";
    } else {
      elements.attack.style.display = "none";
    }

    if (attributes.energy !== 0) {
      elements.energy.textContent = `Energy: ${attributes.energy}`;
      elements.energy.style.display = "";
    } else {
      elements.energy.textContent = "";
      elements.energy.style.display = "none";
    }

    // Generate naming options
    const [prefixOptions, rootOptions, suffixOptions] = [
      getRandomElements(cardData.naming.prefixes, 3),
      getRandomElements(cardData.naming.roots, 3),
      getRandomElements(cardData.naming.suffixes, 3),
    ];

    // Store naming options in dataset for later use
    card.dataset.prefixOptions = JSON.stringify(prefixOptions);
    card.dataset.rootOptions = JSON.stringify(rootOptions);
    card.dataset.suffixOptions = JSON.stringify(suffixOptions);

    // Set default name
    const defaultName = [
      prefixOptions[Math.floor(Math.random() * prefixOptions.length)],
      rootOptions[Math.floor(Math.random() * rootOptions.length)],
      suffixOptions[Math.floor(Math.random() * suffixOptions.length)],
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    elements.name.textContent = defaultName;
  };

  // Function to toggle card selection
  const toggleCardSelection = (card) => {
    if (card.classList.contains("selected")) {
      card.classList.remove("selected");
      selectedCard = null;
      renameSelectedButton.disabled = true;
    } else {
      // Deselect any previously selected card
      const previouslySelected = cardContainer.querySelector(".card.selected");
      if (previouslySelected) previouslySelected.classList.remove("selected");

      // Select the new card
      card.classList.add("selected");
      selectedCard = card;
      renameSelectedButton.disabled = false;
    }
  };

  // Function to populate rename options in the modal
  const populateRenameOptions = () => {
    if (!selectedCard) return;

    const prefixOptions = JSON.parse(selectedCard.dataset.prefixOptions);
    const rootOptions = JSON.parse(selectedCard.dataset.rootOptions);
    const suffixOptions = JSON.parse(selectedCard.dataset.suffixOptions);

    populateDropdown(prefixDropdown, prefixOptions, true);
    populateDropdown(rootDropdown, rootOptions, false);
    populateDropdown(suffixDropdown, suffixOptions, true);

    // Optionally, set a default selection
    const newName = [
      prefixOptions[Math.floor(Math.random() * prefixOptions.length)],
      rootOptions[Math.floor(Math.random() * rootOptions.length)],
      suffixOptions[Math.floor(Math.random() * suffixOptions.length)],
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    selectedCard.querySelector(".card-name").textContent = newName;
  };

  // Function to populate a dropdown with options
  const populateDropdown = (dropdown, options, allowBlank) => {
    dropdown.innerHTML = ""; // Clear existing options

    if (allowBlank) {
      const blankOption = document.createElement("option");
      blankOption.value = "";
      blankOption.textContent = "None";
      dropdown.appendChild(blankOption);
    }

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      dropdown.appendChild(optionElement);
    });
  };

  // Event handler for confirming the new name
  const handleConfirmName = () => {
    if (!selectedCard) return;

    const chosenPrefix = prefixDropdown.value;
    const chosenRoot = rootDropdown.value;
    const chosenSuffix = suffixDropdown.value;

    const newName = [chosenPrefix, chosenRoot, chosenSuffix]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    selectedCard.querySelector(".card-name").textContent = newName;

    // Close the modal and reset selection
    renameModal.style.display = "none";
    selectedCard.classList.remove("selected");
    selectedCard = null;
    renameSelectedButton.disabled = true;
  };

  // Event handler for closing the modal
  const handleCloseModal = () => {
    if (selectedCard) {
      selectedCard.classList.remove("selected");
      selectedCard = null;
      renameSelectedButton.disabled = true;
    }
    renameModal.style.display = "none";
  };

  // Close modal when clicking outside the modal content
  const handleOutsideClick = (event) => {
    if (event.target === renameModal) {
      handleCloseModal();
    }
  };

  // Event listeners
  generateButton.addEventListener("click", generateCard);
  generatePackButton.addEventListener("click", () => generatePack(5));
  renameSelectedButton.addEventListener("click", () => {
    if (selectedCard) {
      populateRenameOptions();
      renameModal.style.display = "block";
    }
  });
  confirmNameButton.addEventListener("click", handleConfirmName);
  closeButton.addEventListener("click", handleCloseModal);
  window.addEventListener("click", handleOutsideClick);
});
