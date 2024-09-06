// Class representing an attack skill a Pokémon can use
class AttackSkill {
  constructor(attack, damage, magic) {
    this.attack = attack; // The name of the attack skill
    this.damage = damage; // The amount of damage the attack inflicts
    this.magic = magic; // The amount of magic required to use the attack
  }
}

// Class representing a Pokémon
class Pokemon {
  constructor(name, health, magic) {
    this.name = name; // The name of the Pokémon
    this.health = health; // The current health points of the Pokémon
    this.magic = magic; // The current magic points of the Pokémon
    this.skills = []; // Array to store the attack skills the Pokémon knows
    this.counter = 0; // Counter for the number of successful attacks performed
    this.defeated = false; // Status flag indicating if the Pokémon has been defeated
  }

  // Method for the Pokémon to learn a new attack skill
  learnAttackSkill(newSkill) {
    if (newSkill instanceof AttackSkill) {
      this.skills.push(newSkill); // Add the new skill to the Pokémon's skill array
    } else {
      console.error("Invalid skill. Must be an instance of AttackSkill."); // Error handling for invalid skill type
    }
  }

  // Method to display the current status of the Pokémon
  showStatus() {
    console.log(
      `${this.name} has ${Math.max(this.health, 0)} health and ${Math.max(
        this.magic,
        0
      )} magic left.`
    );
    if (this.counter > 3) {
      console.log(`${this.name} has won the battle!`); // Indicate if the Pokémon has won based on the attack counter
    }
  }

  // Method to increase the Pokémon's magic points
  getMagic() {
    if (this.isAlive()) {
      const magicBoost = Math.floor(Math.random() * 21); // Generate a random boost between 0 and 20
      this.magic += magicBoost; // Add the boost to the Pokémon's magic
      console.log(`${this.name} regained ${magicBoost} magic.`);
    } else {
      console.log(`${this.name} cannot regain magic because it is defeated.`); // Prevent magic boost if Pokémon is defeated
    }
  }

  // Method to check if the Pokémon has enough magic to perform a specific skill
  hasEnoughMagic(skillName) {
    const skill = this.skills.find(
      (skill) => skill.attack.toLowerCase() === skillName.toLowerCase()
    );
    return skill && this.magic >= skill.magic; // Check if skill exists and if magic is sufficient
  }

  // Method to check if the Pokémon is still alive
  isAlive() {
    return this.health > 0 && !this.defeated; // Return true if health is above 0 and Pokémon is not defeated
  }

  // Helper method to verify if the Pokémon can perform an action
  canPerformAction(skillName, opponent) {
    if (!this.isAlive()) {
      console.log(`${this.name} is defeated and can't attack.`); // Check if the Pokémon is alive
      return false;
    }

    const skill = this.skills.find(
      (skill) => skill.attack.toLowerCase() === skillName.toLowerCase()
    );
    if (!skill) {
      console.log(`${this.name} doesn't know the skill ${skillName}.`); // Check if the Pokémon knows the skill
      return false;
    }

    if (!this.hasEnoughMagic(skillName)) {
      console.log(
        `${this.name} doesn't have enough magic to use ${skillName}.` // Check if the Pokémon has enough magic
      );
      return false;
    }

    if (!opponent.isAlive()) {
      console.log(`${opponent.name} is defeated and can't be attacked.`); // Check if the opponent is alive
      return false;
    }

    return true; // All checks passed, the action can be performed
  }

  // Method to perform an attack on an opponent Pokémon
  attack(skillName, opponent) {
    if (this.defeated || opponent.defeated) {
      console.log("The battle has already ended."); // Check if either Pokémon is defeated
      return;
    }

    if (!this.canPerformAction(skillName, opponent)) return; // Perform preliminary checks

    const skill = this.skills.find(
      (skill) => skill.attack.toLowerCase() === skillName.toLowerCase()
    );
    this.magic -= skill.magic; // Deduct magic cost for the attack
    opponent.health = Math.max(opponent.health - skill.damage, 0); // Apply damage to the opponent, ensuring health does not go below 0
    this.counter += 1; // Increment the successful attack counter

    console.log(
      `${this.name} used ${skillName} and dealt ${skill.damage} damage to ${opponent.name}.`
    );
    this.showStatus(); // Display status of the attacking Pokémon
    opponent.showStatus(); // Display status of the opponent

    if (!opponent.isAlive()) {
      console.log(
        `${opponent.name} has been defeated! ${this.name} wins the battle!`
      );
      opponent.defeated = true; // Mark the opponent as defeated
    }
  }
}

// Example usage

// Create Pokémon with initial health and magic values
let pikachu = new Pokemon("Pikachu", 120, 80);
let bulbasaur = new Pokemon("Bulbasaur", 95, 105);

// Create attack skills
let lightning = new AttackSkill("Lightning", 40, 30);
let poisonSeed = new AttackSkill("Poison Seed", 20, 20);

// Teach Pokémon their attack skills
pikachu.learnAttackSkill(lightning);
pikachu.learnAttackSkill(poisonSeed);
bulbasaur.learnAttackSkill(lightning);
bulbasaur.learnAttackSkill(poisonSeed);

// Simulate a battle sequence between the two Pokémon
pikachu.attack("Lightning", bulbasaur);
bulbasaur.attack("Poison Seed", pikachu);
pikachu.attack("Poison Seed", bulbasaur);
bulbasaur.attack("Lightning", pikachu);
pikachu.attack("Lightning", bulbasaur);
pikachu.attack("Poison Seed", bulbasaur); // Bulbasaur may be defeated already
