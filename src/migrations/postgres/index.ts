import * as migration_20261026_162046_initial from './20261026_162046_initial';
import * as migration_20261026_174135_media_storage from './20261026_174135_media_storage';

export const migrations = [
  {
    up: migration_20261026_162046_initial.up,
    down: migration_20261026_162046_initial.down,
    name: '20261026_162046_initial',
  },
  {
    up: migration_20261026_174135_media_storage.up,
    down: migration_20261026_174135_media_storage.down,
    name: '20261026_174135_media_storage'
  },
];
