// CardLocker.js

// =============================
// Trading Card Data Configuration
// =============================
const cardData = {
  hpRange: { min: 25, max: 40 },
  costRange: { min: 0, max: 4 },
  abilityCostRange: { min: 0, max: 4 },
  energyRange: {
    champion: { min: 2, max: 4 },
    others: { min: 0, max: 5 },
  },
  attackRange: { min: 3, max: 12 },

  abilities: [
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
    // Passive abilities
    { description: "Your champion takes 1 less damage from attacks while active.", isPassive: true, weight: 1, pointValue: 1 },
    { description: "Your champion gains +2 attack while active.", isPassive: true, weight: 1, pointValue: 3 },
    { description: "Your pet gains +2 HP while active.", isPassive: true, weight: 1, pointValue: 2 },
  ],

  types: [
    { value: "Armor", weight: 3, exclude: ["attack"], extraPoints: 2 },
    { value: "Weapon", weight: 2, exclude: ["hp"], extraPoints: 2 },
    { value: "Consumable", weight: 3, exclude: ["hp", "attack", "AbilityCost"], extraPoints: 4 },
    { value: "Pet", weight: 2, exclude: [], extraPoints: 0 },
    { value: "Champion", weight: 1, exclude: ["cost"], extraPoints: -3 },
  ],

  naming: {
    prefixes: {
      All: ["Arcane", "Fabled", "Mirrored", "Dancing", "Smelly", "Whispering", "Recalcitrant", "Hollow", "Vibrant", "Enigmatic"],
      Champion: ["Noble", "Fierce", "Valiant", "Brave", "Heroic", "Mighty", "Grand", "Regal", "Sage", "Warlord's"],
      Armor: ["Iron", "Steel", "Bronze", "Sturdy", "Reinforced", "Heavy", "Runic", "Stone", "Oaken", "Molded"],
      Weapon: ["Sharpened", "Forged", "Runed", "Sturdy", "Steeled", "Cursed", "Refined", "Blazing", "Frosted", "Eternal"],
      Consumable: ["Hearty", "Aromatic", "Sour", "Sweet", "Bitter", "Fiery", "Frosted", "Golden", "Crisp", "Mystic"],
      Pet: ["Loyal", "Wild", "Fierce", "Gentle", "Swift", "Ghostly", "Ancient", "Playful", "Cunning", "Timid"]
    },
    roots: {
      All: ["Construct", "Entity", "Curio", "Spark", "Fragment", "Cinder", "Riddle", "Echo", "Whimsy", "Corpus", "Symbiotic"],
      Champion: ["Knight", "Guardian", "Champion", "Paladin", "Lord", "Emissary", "Marshal", "Warden", "Seer", "Monarch"],
      Armor: ["Vestment", "Regalia", "Guard", "Aegis", "Barrier", "Shell", "Mantle", "Carapace", "Casing", "Ward"],
      Weapon: ["Armament", "Kill Thing", "Artifact", "Wargear", "Instrument","Relic", "Contrivance", "Toothpick", "Device", "Engine"],
      Consumable: ["Essence", "Mixture", "Infusion", "Ration", "Concoction", "Formula", "Blend", "Extract", "Elixir", "Substance"],
      Pet: ["Beast", "Familiar", "Companion", "Creature", "Entity", "Ally", "Partner", "Spirit", "Chimeric", "Guardian"]
    },
    suffixes: {
      All: ["of Echoes", "of Whispers", "of the Beyond", "of Fates", "the Unbound", "of Ashes", "of Secrets", "the Quivering", "the Hidden", "of the Lost"],
      Champion: ["of Dawn", "the Protector", "the Swift", "the Mighty", "the Fearless", "the Great", "the Valiant", "of Light", "the Wise", "the Bold"],
      Armor: ["of Protection", "the Defender", "Guard", "Ward", "Shelter", "Bastion", "Aegis", "Barrier", "Bulwark", "of Stalwart"],
      Weapon: ["of Cutting", "of Striking", "Edge", "Bite", "Fang", "Cleave", "Strike", "Claw", "Point", "of Fury"],
      Consumable: ["of Vigor", "of Whimsy", "of the Gods", "of Duty", "Tonic", "Remedy", "Essence", "Cordial", "Draught", "Infusion"],
      Pet: ["of the Forest", "of Night", "of Storms", "of the Wilds", "Whisper", "Wing", "Claw", "Fang", "Howl", "of the Glen"]
    },
  }
};

// Global variables for images and artists
let cardImagesData = null;
let encounteredArtists = new Set();
const artistListDiv = document.getElementById("artist-list");

// Define generateCard before DOMContentLoaded so it's available
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

// Finalize card attributes and pick image and artist
const finalizeCardAttributes = (card) => {
  const elements = {
    type: card.querySelector(".card-type"),
    cost: card.querySelector(".card-cost"),
    hp: card.querySelector(".card-hp"),
    attack: card.querySelector(".card-attack"),
    abilities: card.querySelector(".card-abilities"),
    energy: card.querySelector(".card-energy"),
    name: card.querySelector(".card-name"),
    img: card.querySelector(".card-art"),
  };

  const MIN_POINTS = 8;
  const MAX_POINTS = 12;

  const typeItem = pickRandomWeighted(cardData.types);
  const { value: type, exclude, extraPoints } = typeItem;
  const isChampion = type === "Champion";

  let attributes = {};
  let totalPoints;

  do {
    totalPoints = extraPoints;

    const ability = generateAbility();
    attributes.abilityDesc = ability.description;
    attributes.isPassive = ability.isPassive;
    totalPoints += ability.pointValue;

    let costData = null;
    if (!exclude.includes("cost")) {
      costData = generateCost();
      attributes.cost = costData.cost;
      totalPoints += costData.pointValue;
    } else {
      attributes.cost = null;
    }

    if (!exclude.includes("hp")) {
      const hpData = generateHP();
      attributes.hp = hpData.hp;
      totalPoints += hpData.pointValue;
    } else {
      attributes.hp = null;
    }

    if (!exclude.includes("attack")) {
      const attackData = generateAttack();
      attributes.attack = attackData.attack;
      totalPoints += attackData.pointValue;
    } else {
      attributes.attack = null;
    }

    const energyData = generateEnergy(isChampion);
    attributes.energy = energyData.energy;
    totalPoints += energyData.pointValue;

    if (!attributes.isPassive && type !== "Consumable" && !exclude.includes("AbilityCost")) {
      const abilityCostData = generateAbilityCost();
      attributes.abilityCost = abilityCostData.abilityCost;
      totalPoints += abilityCostData.pointValue;
    } else {
      attributes.abilityCost = null;
    }

  } while (totalPoints < MIN_POINTS || totalPoints > MAX_POINTS);

  let finalAbilityText = attributes.abilityDesc;
  if (attributes.isPassive) {
    if (elements.type.textContent === "Consumable") {
      finalAbilityText = "This turn only: " + finalAbilityText;
    }
  } else {
    if (elements.type.textContent !== "Consumable" && attributes.abilityCost !== null) {
      finalAbilityText = `${attributes.abilityCost}⚡ ${finalAbilityText}`;
    }
  }

  elements.type.textContent = type;
  elements.abilities.textContent = finalAbilityText;

  if (attributes.cost !== null) {
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

  const combinedPrefixOptions = [...cardData.naming.prefixes.All, ...cardData.naming.prefixes[type]];
  const combinedRootOptions = [...cardData.naming.roots.All, ...cardData.naming.roots[type]];
  const combinedSuffixOptions = [...cardData.naming.suffixes.All, ...cardData.naming.suffixes[type]];

  const prefixOptions = getRandomElements(combinedPrefixOptions, 3);
  const rootOptions = getRandomElements(combinedRootOptions, 3);
  const suffixOptions = getRandomElements(combinedSuffixOptions, 3);

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

  // Attempt to set image and artist if data is available
  console.log("Attempting to set image for type:", type);
  if (cardImagesData && cardImagesData[type]) {
    const typeArtists = Object.keys(cardImagesData[type]);
    console.log("Found artists for type:", type, typeArtists);
    if (typeArtists.length > 0) {
      const randArtist = typeArtists[Math.floor(Math.random() * typeArtists.length)];
      const images = cardImagesData[type][randArtist];
      console.log("Choosing artist:", randArtist, "images:", images);
      if (images && images.length > 0) {
        const randImage = images[Math.floor(Math.random() * images.length)];
        console.log("Selected image:", randImage);
        elements.img.src = `CardImages/${type}/${encodeURIComponent(randArtist)}/${encodeURIComponent(randImage)}`;
        encounteredArtists.add(randArtist);
        updateArtistList();
      } else {
        console.log("No images found for artist:", randArtist, "in type:", type);
      }
    } else {
      console.log("No artists found for type:", type);
    }
  } else {
    console.log("No cardImagesData for type:", type);
  }
};

function updateArtistList() {
  if (encounteredArtists.size > 0) {
    artistListDiv.textContent = "Artist(s): " + Array.from(encounteredArtists).join(", ");
  } else {
    artistListDiv.textContent = "";
  }
}

function toggleCardSelection(card) {
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
}

function populateRenameOptions() {
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
}

function populateDropdown(dropdown, options, allowBlank) {
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
}

function handleConfirmName() {
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
}

function handleCloseModal() {
  if (selectedCard) {
    selectedCard.classList.remove("selected");
    selectedCard = null;
    renameSelectedButton.disabled = true;
  }
  renameModal.style.display = "none";
}

function handleOutsideClick(event) {
  if (event.target === renameModal) {
    handleCloseModal();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  window.cardContainer = document.getElementById("card-container");
  const generateButton = document.getElementById("generate-button");
  const generatePackButton = document.getElementById("generate-pack-button");
  const renameSelectedButton = document.getElementById("rename-selected-button");
  const renameModal = document.getElementById("rename-modal");
  const closeButton = document.querySelector(".close-button");
  const prefixDropdown = document.getElementById("prefix-dropdown");
  const rootDropdown = document.getElementById("root-dropdown");
  const suffixDropdown = document.getElementById("suffix-dropdown");
  const confirmNameButton = document.getElementById("confirm-name-button");

  // Disable generation until cardImages.json is loaded
  generateButton.disabled = true;
  generatePackButton.disabled = true;

  try {
    const response = await fetch("cardImages.json");
    cardImagesData = await response.json();
    console.log("cardImagesData loaded:", cardImagesData);
  } catch (err) {
    console.error("Failed to load cardImages.json:", err);
  }

  // Now enable generation
  generateButton.disabled = false;
  generatePackButton.disabled = false;

  generateButton.addEventListener("click", generateCard);
  generatePackButton.addEventListener("click", () => generatePack(5));
  renameSelectedButton.addEventListener("click", () => {
    if (window.selectedCard) {
      populateRenameOptions();
      renameModal.style.display = "block";
    }
  });
  confirmNameButton.addEventListener("click", handleConfirmName);
  closeButton.addEventListener("click", handleCloseModal);
  window.addEventListener("click", handleOutsideClick);
});
