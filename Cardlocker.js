// CardLocker.js

// =============================
// Trading Card Data Configuration
// Users can edit the data below to customize the trading cards.
// =============================

const cardData = {
  hpRange: { min: 25, max: 40 },
  costRange: { min: 0, max: 4 },
  abilityCostRange: { min: 0, max: 4 }, // Similar distribution to cost
  energyRange: {
    champion: { min: 2, max: 4 },
    others: { min: 0, max: 5 },
  },
  attackRange: { min: 3, max: 12 },

  abilities: [
    // Active abilities (isPassive: false)
    { description: "Deal 5 damage.", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Heal 5 HP.", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Draw a card.", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Paralyze target (50% chance cannot attack next turn).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Steal 1 energy from opponent this turn.", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Heal your champion and all pets by 5 HP.", isPassive: false, weight: 1, pointValue: 4 },
    { description: "Target takes 15 damage at the end of their next 3 turns (Bleed).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Target takes 20 damage at the start of their next 2 turns (Poison).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Remove all conditions from a target (Dispel).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Gain +2 HP immediately (Fortify).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Gain +1 energy this turn only (Energize).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Target equipment cannot be used next turn (Disable).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Return a Pet from your discard pile to your hand (Revive).", isPassive: false, weight: 1, pointValue: 4 },
    { description: "Your next card played this turn costs 1 less energy (Swift Move).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Deal 7 damage immediately (Fireball).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Control opponent's Pet until end of this turn (Mind Control).", isPassive: false, weight: 1, pointValue: 4 },
    { description: "Return a consumable from your discard pile to your hand (Recycle).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Deal 3 damage to yourself and draw two cards (Sacrifice).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Your champion can't be targeted until your next turn starts (Stealth).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Target cannot attack on their next turn (Freeze).", isPassive: false, weight: 1, pointValue: 3 },
    { description: "Deal 10 damage to all opponents (Meteor Strike).", isPassive: false, weight: 1, pointValue: 5 },
    { description: "Your champion gains +3 attack this turn only (Enrage).", isPassive: false, weight: 1, pointValue: 2 },
    { description: "Next time opponent attacks this turn, they take 5 damage (Trap).", isPassive: false, weight: 1, pointValue: 3 },

    // Passive abilities (isPassive: true)
    { description: "Your champion takes 1 less damage from attacks while active.", isPassive: true, weight: 1, pointValue: 1 },
    { description: "Your champion gains +2 attack while active.", isPassive: true, weight: 1, pointValue: 3 },
    { description: "Your pet gains +2 HP while active.", isPassive: true, weight: 1, pointValue: 2 },
  ],

  types: [
    { value: "Armor", weight: 3, exclude: ["attack", "AbilityCost"], extraPoints: 2 },
    { value: "Weapon", weight: 2, exclude: ["hp"], extraPoints: 2 },
    { value: "Consumable", weight: 3, exclude: ["hp", "attack", "AbilityCost"], extraPoints: 4 },
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

// ======================================
// Helper Functions and Event Listeners
// ======================================

document.addEventListener("DOMContentLoaded", () => {
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

  // Range adjustments:
  // Previously 7-10 for max ~14. Now max ~19 originally considered, but we adjusted range to 8-12.
  // We'll finalize 8 to 12 as the acceptable point range.

  const MIN_POINTS = 8;
  const MAX_POINTS = 12;

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

  // We can reuse generateMiddlePeakNumber for AbilityCost too, since we want a similar distribution.

  const generateCost = () => {
    const { min, max } = cardData.costRange;
    const cost = generateMiddlePeakNumber(min, max);
    // Cost point system:
    // 0 cost = +4 points
    // 1 cost = +2 points
    // 2 cost = 0 points
    // 3 cost = -2 points
    // 4 cost = -4 points
    const costPointMap = { 0: 4, 1: 2, 2: 0, 3: -2, 4: -4 };
    return { cost, pointValue: costPointMap[cost] };
  };

  const generateAbilityCost = () => {
    const { min, max } = cardData.abilityCostRange;
    const abilityCost = generateMiddlePeakNumber(min, max);
    const costPointMap = { 0: 4, 1: 2, 2: 0, 3: -2, 4: -4 };
    return { abilityCost, pointValue: costPointMap[abilityCost] };
  };

  // Generates a biased random number between a and b using exponential decay (for energy)
  const generateBiasedRandom = (a, b) => {
    const c = a + 0.2 * (b - a);
    const targetProbability = 0.7;
    const k = -Math.log(1 - targetProbability) / (c - a);
    const u = Math.random();
    return a - (1 / k) * Math.log(1 - u * (1 - Math.exp(-k * (b - a))));
  };

  const generateHP = () => {
    const { min, max } = cardData.hpRange;
    const hp = generateMiddlePeakNumber(min, max);
    const range = max - min;
    const firstThreshold = min + range * 0.2;
    const secondThreshold = min + range * 0.6;

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

  const generateEnergy = (isChampion) => {
    const { min, max } = isChampion
      ? cardData.energyRange.champion
      : cardData.energyRange.others;

    const energy = Math.floor(generateBiasedRandom(min, max));
    const pointValue = energy; 
    return { energy, pointValue };
  };

  const generateAttack = () => {
    const { min, max } = cardData.attackRange;
    const attack = generateMiddlePeakNumber(min, max);
    const range = max - min;
    const firstThreshold = min + range * 0.2;
    const secondThreshold = min + range * 0.6;

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

  const generateAbility = () => {
    const ability = pickRandomWeighted(cardData.abilities);
    return { description: ability.description, isPassive: ability.isPassive, pointValue: ability.pointValue };
  };

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

  const generateCard = () => {
    const card = createCardElement();
    finalizeCardAttributes(card);
    cardContainer.appendChild(card);
  };

  const generatePack = (count = 5) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const card = createCardElement();
      fragment.appendChild(card);
    }
    cardContainer.appendChild(fragment);

    const newCards = cardContainer.querySelectorAll(".card:not([data-generated])");
    newCards.forEach((card) => {
      card.dataset.generated = "true";
      finalizeCardAttributes(card);
    });
  };

  const finalizeCardAttributes = (card) => {
    const elements = {
      type: card.querySelector(".card-type"),
      cost: card.querySelector(".card-cost"),
      hp: card.querySelector(".card-hp"),
      attack: card.querySelector(".card-attack"),
      abilities: card.querySelector(".card-abilities"),
      energy: card.querySelector(".card-energy"),
      name: card.querySelector(".card-name"),
    };

    const typeItem = pickRandomWeighted(cardData.types);
    const { value: type, exclude, extraPoints } = typeItem;
    const isChampion = type === "Champion";

    let attributes = {};
    let totalPoints;

    do {
      totalPoints = extraPoints;

      // Generate Ability
      const ability = generateAbility();
      attributes.abilityDesc = ability.description;
      attributes.isPassive = ability.isPassive;
      totalPoints += ability.pointValue;

      // Generate Cost (Card Cost)
      let costData = null;
      if (!exclude.includes("cost")) {
        costData = generateCost();
        attributes.cost = costData.cost;
        totalPoints += costData.pointValue;
      } else {
        attributes.cost = null;
      }

      // Generate HP
      if (!exclude.includes("hp")) {
        const hpData = generateHP();
        attributes.hp = hpData.hp;
        totalPoints += hpData.pointValue;
      } else {
        attributes.hp = null;
      }

      // Generate Attack
      if (!exclude.includes("attack")) {
        const attackData = generateAttack();
        attributes.attack = attackData.attack;
        totalPoints += attackData.pointValue;
      } else {
        attributes.attack = null;
      }

      // Generate Energy
      const energyData = generateEnergy(isChampion);
      attributes.energy = energyData.energy;
      totalPoints += energyData.pointValue;

      // Generate AbilityCost if needed:
      // Only if ability is active (not passive), and type is not Consumable, and AbilityCost not excluded.
      if (!attributes.isPassive && type !== "Consumable" && !exclude.includes("AbilityCost")) {
        const abilityCostData = generateAbilityCost();
        attributes.abilityCost = abilityCostData.abilityCost;
        totalPoints += abilityCostData.pointValue;
      } else {
        attributes.abilityCost = null;
      }

    } while (totalPoints < MIN_POINTS || totalPoints > MAX_POINTS);

    // Now adjust the displayed text:
    // Replace "Cost:" with "⚡"
    // For abilities:
    // - If passive and not Consumable: show description as is.
    // - If passive and Consumable: prepend "This turn only:".
    // - If active and not Consumable: prepend "[AbilityCost]⚡ " if abilityCost exists.
    // - If active and Consumable: just show description (the card cost is the ability cost effectively).

    let finalAbilityText = attributes.abilityDesc;

    if (attributes.isPassive) {
      if (type === "Consumable") {
        // Passive + Consumable
        finalAbilityText = "This turn only: " + finalAbilityText;
      } else {
        // Passive + Not Consumable
        // Just leave the description as is.
      }
    } else {
      // Ability is active
      if (type !== "Consumable" && attributes.abilityCost !== null) {
        // Active, non-consumable with ability cost
        finalAbilityText = `${attributes.abilityCost}⚡ ${finalAbilityText}`;
      } else {
        // Active + Consumable or no ability cost (excluded)
        // Just show the description as is.
      }
    }

    // Populate card elements
    elements.type.textContent = type;
    elements.abilities.textContent = finalAbilityText;

    if (attributes.cost !== null) {
      // Replace word "Cost:" with "⚡"
      elements.cost.textContent = `⚡ ${attributes.cost}`;
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

    // Naming
    const [prefixOptions, rootOptions, suffixOptions] = [
      getRandomElements(cardData.naming.prefixes, 3),
      getRandomElements(cardData.naming.roots, 3),
      getRandomElements(cardData.naming.suffixes, 3),
    ];

    card.dataset.prefixOptions = JSON.stringify(prefixOptions);
    card.dataset.rootOptions = JSON.stringify(rootOptions);
    card.dataset.suffixOptions = JSON.stringify(suffixOptions);

    const defaultName = [
      prefixOptions[Math.floor(Math.random() * prefixOptions.length)],
      rootOptions[Math.floor(Math.random() * rootOptions.length)],
      suffixOptions[Math.floor(Math.random() * suffixOptions.length)],
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    elements.name.textContent = defaultName;
  };

  const toggleCardSelection = (card) => {
    if (card.classList.contains("selected")) {
      card.classList.remove("selected");
      selectedCard = null;
      renameSelectedButton.disabled = true;
    } else {
      const previouslySelected = cardContainer.querySelector(".card.selected");
      if (previouslySelected) previouslySelected.classList.remove("selected");
      card.classList.add("selected");
      selectedCard = card;
      renameSelectedButton.disabled = false;
    }
  };

  const populateRenameOptions = () => {
    if (!selectedCard) return;

    const prefixOptions = JSON.parse(selectedCard.dataset.prefixOptions);
    const rootOptions = JSON.parse(selectedCard.dataset.rootOptions);
    const suffixOptions = JSON.parse(selectedCard.dataset.suffixOptions);

    populateDropdown(prefixDropdown, prefixOptions, true);
    populateDropdown(rootDropdown, rootOptions, false);
    populateDropdown(suffixDropdown, suffixOptions, true);

    const newName = [
      prefixOptions[Math.floor(Math.random() * prefixOptions.length)],
      rootOptions[Math.floor(Math.random() * rootOptions.length)],
      suffixOptions[Math.floor(Math.random() * suffixOptions.length)],
    ]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    selectedCard.querySelector(".card-name").textContent = newName;
  };

  const populateDropdown = (dropdown, options, allowBlank) => {
    dropdown.innerHTML = "";
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

  const handleConfirmName = () => {
    if (!selectedCard) return;

    const chosenPrefix = prefixDropdown.value;
    const chosenRoot = rootDropdown.value;
    const chosenSuffix = suffixDropdown.value;

    const newName = [chosenPrefix, chosenRoot, chosenSuffix]
      .filter(Boolean)
      .join(" ") || "Unnamed Card";

    selectedCard.querySelector(".card-name").textContent = newName;

    renameModal.style.display = "none";
    selectedCard.classList.remove("selected");
    selectedCard = null;
    renameSelectedButton.disabled = true;
  };

  const handleCloseModal = () => {
    if (selectedCard) {
      selectedCard.classList.remove("selected");
      selectedCard = null;
      renameSelectedButton.disabled = true;
    }
    renameModal.style.display = "none";
  };

  const handleOutsideClick = (event) => {
    if (event.target === renameModal) {
      handleCloseModal();
    }
  };

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
