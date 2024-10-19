import { calculateTotalWordCount } from './total-word-count.js';

async function calculateLevelInfo() {
  try {
    const totalWordCount = await calculateTotalWordCount();
    const xp = totalWordCount; // XP is equal to the total number of words read

    // Calculate current level
    const currentLevel = Math.floor(Math.sqrt(xp / 1000));

    // Calculate total XP needed for next level
    const nextLevel = currentLevel + 1;
    const totalXpForNextLevel = nextLevel * nextLevel * 1000;

    // Calculate XP gained for next level
    const xpForCurrentLevel = currentLevel * currentLevel * 1000;
    const xpGainedForNextLevel = xp - xpForCurrentLevel;

    // Calculate percent progress for next level
    const xpRequiredForNextLevel = totalXpForNextLevel - xpForCurrentLevel;
    const percentProgress = (xpGainedForNextLevel / xpRequiredForNextLevel) * 100;

    return {
      currentLevel,
      totalXpForNextLevel,
      xpGainedForNextLevel,
      percentProgress: Math.round(percentProgress * 100) / 100, // Round to 2 decimal places
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      currentLevel: 0,
      totalXpForNextLevel: 1000,
      xpGainedForNextLevel: 0,
      percentProgress: 0,
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  calculateLevelInfo().then(({ currentLevel, totalXpForNextLevel, xpGainedForNextLevel, percentProgress }) => {
    console.log(`Current level: ${currentLevel}`);
    console.log(`Total XP needed for next level: ${totalXpForNextLevel}`);
    console.log(`XP gained for next level: ${xpGainedForNextLevel}`);
    console.log(`Percent progress towards next level: ${percentProgress}%`);
  });
}

export { calculateLevelInfo };
