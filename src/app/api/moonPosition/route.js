import { join } from 'path';

let swisseph;
try {
  swisseph = require('swisseph');
} catch (error) {
  console.error('Failed to load swisseph:', error);
}

const rashis = [
  'Mesh', 'Vrishab', 'Mithun', 'Kark', 
  'Simha', 'Kanya', 'Tula', 'Vrischik', 
  'Dhanu', 'Makar', 'Kumbha', 'Meen'
];

export async function GET() {
  if (!swisseph) {
    return new Response(JSON.stringify({ error: 'Swiss Ephemeris not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    swisseph.swe_set_ephe_path(join(process.cwd(), 'public', 'ephemeris'));

    const now = new Date();
    const julday = swisseph.swe_julday(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate(),
      now.getUTCHours() + now.getUTCMinutes() / 60,
      swisseph.SE_GREG_CAL
    );

    const flag = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SIDEREAL;
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

    const moonData = swisseph.swe_calc_ut(julday, swisseph.SE_MOON, flag);

    if (moonData.error) {
      throw new Error(moonData.error);
    }

    const longitude = moonData.longitude;
    const rashi = Math.floor(longitude / 30);
    const chandrashtamRashi = (rashi + 5) % 12; // Calculate the rashi that is affected by Chandrashtam

    // Debug information
    const debugInfo = {
      currentDate: now.toISOString(),
      julianDay: julday,
      moonLongitude: longitude,
      calculatedRashi: rashi,
      rashiName: rashis[rashi],
      chandrashtamRashiName: rashis[chandrashtamRashi],
      rawMoonData: moonData,
      ayanamsa: swisseph.swe_get_ayanamsa_ut(julday),
    };

    return new Response(JSON.stringify({ 
      rashi, 
      rashiName: rashis[rashi],
      chandrashtamRashi,
      chandrashtamRashiName: rashis[chandrashtamRashi],
      longitude, 
      debug: debugInfo 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calculating moon position:', error);
    return new Response(JSON.stringify({ error: 'Failed to calculate moon position', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}