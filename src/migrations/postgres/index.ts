import * as migration_20261026_162046_initial from './20261026_162046_initial';
import * as migration_20261026_174135_media_storage from './20261026_174135_media_storage';
import * as migration_20261027_132010_stay_availability from './20261027_132010_stay_availability';

export const migrations = [
  {
    up: migration_20261026_162046_initial.up,
    down: migration_20261026_162046_initial.down,
    name: '20261026_162046_initial',
  },
  {
    up: migration_20261026_174135_media_storage.up,
    down: migration_20261026_174135_media_storage.down,
    name: '20261026_174135_media_storage',
  },
  {
    up: migration_20261027_132010_stay_availability.up,
    down: migration_20261027_132010_stay_availability.down,
    name: '20261027_132010_stay_availability'
  },
];
