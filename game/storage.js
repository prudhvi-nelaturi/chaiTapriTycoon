// Persistence layer. Keeps AsyncStorage details out of the UI and engine.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAVE_KEY } from './config';
import { newGame } from './engine';

export async function loadGame() {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (!raw) return newGame();
    const parsed = JSON.parse(raw);
    // Merge over a fresh game so missing fields (from older saves) get defaults.
    return { ...newGame(), ...parsed };
  } catch (e) {
    return newGame();
  }
}

export async function saveGame(state) {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // Best-effort; a failed save shouldn't crash the game.
  }
}

export async function resetGame() {
  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch (e) {}
  return newGame();
}
