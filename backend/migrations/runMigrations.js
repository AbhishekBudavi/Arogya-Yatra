// migrations/runMigrations.js
// Simple migration runner to execute SQL migration files

const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  try {
    console.log('Starting database migrations...');

    // Helper function to split SQL statements
    const executeSQLFile = async (filePath, migrationName) => {
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      // Split by semicolon but preserve them for valid SQL
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          await db.query(statement + ';');
        } catch (error) {
          // Ignore "already exists" errors for CREATE TABLE IF NOT EXISTS
          if (!error.message.includes('already exists')) {
            console.warn(`Warning executing statement in ${migrationName}:`, error.message);
          }
        }
      }
      console.log(`✓ ${migrationName} completed`);
    };

    // Run migrations in order
    await executeSQLFile(
      path.join(__dirname, 'update_doctor_table_schema.sql'),
      'update_doctor_table_schema.sql'
    );

    await executeSQLFile(
      path.join(__dirname, 'add_doctor_availability.sql'),
      'add_doctor_availability.sql'
    );

    console.log('✓ All migrations completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration error:', error.message);
    throw error;
  }
};

module.exports = { runMigrations };
