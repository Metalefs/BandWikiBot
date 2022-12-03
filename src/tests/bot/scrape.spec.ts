import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';
import { Navigator } from '../../bot/shared/navigator';

describe('Scrape', () => {
  test('search Eminence', async () => {
    const query = {
      name: 'Eminence'
    };
    const navigator = new Navigator(/*browser as any*/)
    const start = performance.now();
    const data = await navigator.searchMetalArchives(query);
    const duration = (performance.now() - start);
    const result = { duration, data }
    
    fs.writeFileSync(
      `./src/tests/bot/results/scrape/result.json`,
      JSON.stringify(result,null,4)
    );

    expect(result).toBeTruthy();

  }, 20000);
});