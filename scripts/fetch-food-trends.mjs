import 'dotenv/config';
import { writeFile } from 'node:fs/promises';
import { getFoodTrends } from './reddit-food-trends.mjs';

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outPath = outIndex >= 0 ? args[outIndex + 1] : null;

try {
  const trends = await getFoodTrends();
  const json = JSON.stringify(trends, null, 2);

  if (outPath) {
    await writeFile(outPath, json);
    console.log(`Wrote ${trends.length} posts to ${outPath}`);
  } else {
    console.log(json);
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
