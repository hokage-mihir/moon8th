// src/app/utils/swissEphemeris.js

export async function getMoonPosition() {
    const response = await fetch('/api/moonPosition');
    if (!response.ok) {
      throw new Error('Failed to fetch moon position');
    }
    return response.json();
  }
  
  export const rashis = [
    'Mesh', 'Vrishab', 'Mithun', 'Kark', 
    'Simha', 'Kanya', 'Tula', 'Vrischik', 
    'Dhanu', 'Makar', 'Kumbha', 'Meen'
  ];