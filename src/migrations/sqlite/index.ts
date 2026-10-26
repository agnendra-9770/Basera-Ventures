import * as migration_20261026_142506_initial from './20261026_142506_initial';
import * as migration_20261026_152904_stay_location_and_ratings from './20261026_152904_stay_location_and_ratings';

export const migrations = [
  {
    up: migration_20261026_142506_initial.up,
    down: migration_20261026_142506_initial.down,
    name: '20261026_142506_initial',
  },
  {
    up: migration_20261026_152904_stay_location_and_ratings.up,
    down: migration_20261026_152904_stay_location_and_ratings.down,
    name: '20261026_152904_stay_location_and_ratings'
  },
];
