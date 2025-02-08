import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { exec } from 'child_process';

const LOG_FILE = 'backup_log.txt';

const getTimestamp = (): string => new Date().toISOString().replace(/[:.]/g, '-');

/**
 * Calculates a SHA-256 checksum for the top-level contents of a directory.
 *
 * @param directory - The directory whose top-level entries are hashed.
 * @returns {Promise<string>} The SHA-256 hash of the sorted entries.
 */
const calculateDirectoryChecksum = async (directory: string): Promise<string> => {
    try {
        const entries = await fs.readdir(directory);
        entries.sort(); // Ensure consistent order
        return crypto.createHash('sha256').update(entries.join(','), 'utf8').digest('hex');
    } catch (error) {
        console.log(`Error reading directory ${directory}:`, error);
        process.exit(1);
    }
};

const readLastBackupHash = async (): Promise<string | null> => {
    try {
        const logData = await fs.readFile(LOG_FILE, 'utf8');
        const logEntries = logData.trim().split('\n');
        for (let i = logEntries.length - 1; i >= 0; i--) {
            const match = logEntries[i].match(/HASH: ([a-f0-9]+)/);
            if (match) return match[1];
        }
    } catch (error: unknown) {
        // Cast error to NodeJS.ErrnoException to safely access error.code
        const err = error as NodeJS.ErrnoException;
        if (err.code !== 'ErrNoEntry') {
            console.log('Error reading log file:', error);
        }
    }
    return null;
};

const appendToLog = async (message: string): Promise<void> => {
    const timestamp = new Date().toISOString();
    await fs.appendFile(LOG_FILE, `${timestamp}: ${message}\n`);
};

const createBackup = async (sourceDir: string, destinationDir: string, newHash: string): Promise<void> => {
    try {
        const backupFileName = `backup-${getTimestamp()}.tar.gz`;
        const backupFilePath = path.join(destinationDir, backupFileName);

        await fs.mkdir(destinationDir, { recursive: true });
        
        const command = `tar -czf "${backupFilePath}" -C "${sourceDir}" .`;
        exec(command, async (error) => {
            if (error) {
                console.log('Backup failed:', error);
                await appendToLog('FAILED: tar command failed');
            } else {
                await appendToLog(`SUCCESS: Backup created at ${backupFilePath}, HASH: ${newHash}`);
                console.log(`Backup successful: ${backupFilePath}`);
            }
        });
    } catch (error) {
        console.log('Error creating backup:', error);
        process.exit(1);
    }
};

const main = async (): Promise<void> => {
    if (process.argv.length < 4) {
        console.log('Usage: ts-node index.ts <source-directory> <destination-directory>');
        process.exit(1);
    }
    
    const sourceDir = process.argv[2];
    const destinationDir = process.argv[3];
    
    const newHash = await calculateDirectoryChecksum(sourceDir);
    const lastHash = await readLastBackupHash();
    
    if (newHash === lastHash) {
        console.log('No changes detected. Skipping backup.');
        await appendToLog('SKIPPED: No changes detected');
    } else {
        await createBackup(sourceDir, destinationDir, newHash);
    }
};

main();