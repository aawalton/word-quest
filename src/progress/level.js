import { calculateTotalWordCount } from './total-word-count.js';

async function calculateLevelInfo() {
  try {
    const totalWordCount = await calculateTotalWordCount();
    const xp = totalWordCount; // XP is equal to the total number of words read

    // Calculate current level
    const currentLevel = Math.floor(Math.sqrt(xp / 1000));

    // Calculate total XP gained
    const totalXpGained = xp;

    // Calculate XP needed for next level
    const nextLevel = currentLevel + 1;
    const totalXpForNextLevel = nextLevel * nextLevel * 1000;
    const xpForCurrentLevel = currentLevel * currentLevel * 1000;
    const xpForNextLevel = totalXpForNextLevel - xpForCurrentLevel;

    // Calculate progress towards next level
    const xpGainedForNextLevel = xp - xpForCurrentLevel;
    const percentProgress = (xpGainedForNextLevel / xpForNextLevel) * 100;

    return {
      currentLevel,
      totalXpGained,
      xpForNextLevel,
      xpGainedForNextLevel,
      percentProgress: Math.round(percentProgress * 100) / 100, // Round to 2 decimal places
      totalXpForNextLevel,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      currentLevel: 0,
      totalXpGained: 0,
      xpForNextLevel: 1000,
      xpGainedForNextLevel: 0,
      percentProgress: 0,
      totalXpForNextLevel: 1000,
    };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  calculateLevelInfo().then(({ currentLevel, totalXpGained, xpForNextLevel, xpGainedForNextLevel, percentProgress, totalXpForNextLevel }) => {
    console.log(`Current level: ${currentLevel}`);
    console.log(`Total XP gained: ${totalXpGained}`);
    console.log(`XP needed for next level: ${xpForNextLevel}`);
    console.log(`XP gained for next level: ${xpGainedForNextLevel}`);
    console.log(`Percent progress towards next level: ${percentProgress}%`);
    console.log(`Total XP needed for next level: ${totalXpForNextLevel}`);
  });
}

export { calculateLevelInfo };
