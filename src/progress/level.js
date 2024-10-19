import { calculateTotalWordCount } from './total-word-count.js';

async function calculateLevelInfo() {
  try {
    const totalWordCount = await calculateTotalWordCount();
    const totalXp = totalWordCount; // Total XP is equal to the total number of words read

    // Calculate current level
    const currentLevel = Math.floor(Math.sqrt(totalXp / 1000));

    // Calculate XP needed for next level
    const nextLevel = currentLevel + 1;
    const xpNeededForNextLevel = nextLevel * nextLevel * 1000;
    const xpNeededForCurrentLevel = currentLevel * currentLevel * 1000;
    const xpRemainingForNextLevel = xpNeededForNextLevel - xpNeededForCurrentLevel;

    // Calculate progress towards next level
    const xpGainedTowardsNextLevel = totalXp - xpNeededForCurrentLevel;
    const percentProgressToNextLevel = (xpGainedTowardsNextLevel / xpRemainingForNextLevel) * 100;

    return {
      currentLevel,
      totalXp,
      xpRemainingForNextLevel,
      xpGainedTowardsNextLevel,
      percentProgressToNextLevel: Math.round(percentProgressToNextLevel * 100) / 100, // Round to 2 decimal places
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      currentLevel: 0,
      totalXp: 0,
      xpRemainingForNextLevel: 1000,
      xpGainedTowardsNextLevel: 0,
      percentProgressToNextLevel: 0,
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  calculateLevelInfo().then(({ currentLevel, totalXp, xpRemainingForNextLevel, xpGainedTowardsNextLevel, percentProgressToNextLevel, xpNeededForNextLevel }) => {
    console.log(`Current level: ${currentLevel}`);
    console.log(`Total XP: ${totalXp}`);
    console.log(`XP needed for next level: ${xpRemainingForNextLevel}`);
    console.log(`XP gained for next level: ${xpGainedTowardsNextLevel}`);
    console.log(`Progress towards next level: ${percentProgressToNextLevel}%`);
  });
}

export { calculateLevelInfo };
