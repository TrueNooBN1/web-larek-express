import cron from 'node-cron';
import { Stats } from 'fs';
import fs from 'fs/promises';

const path = require('path');

export const cleanupTempFiles = (maxAgeHours: number = 24) => {
  const tempDir = path.join(__dirname, 'public', 'temp');
  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;
  try {
    fs.readdir(tempDir)
      .then((files: string[]) => {
        files.forEach((file) => {
          const filePath = path.join(tempDir, file);
          fs.stat(filePath)
            .then((stats: Stats) => {
              if (now - stats.mtime.getTime() > maxAge) {
                fs.unlink(filePath)
                  .then(() => {
                    // console.log(`Deleted old temp file: ${file}`);
                  });
              }
            });
        });
      });
  } catch (error) {
    // console.error('Error cleaning temp files:', error);
  }
};

export const startCleanupJob = () => {
  // '0 */6 * * *' - каждые 6 часов

  cron.schedule('0 */6 * * *', async () => {
    try {
      await cleanupTempFiles(6);
      // console.log('Cleanup completed');
    } catch (err) {
      // console.log('Cleanup failed:', error);
    }
  });
};
