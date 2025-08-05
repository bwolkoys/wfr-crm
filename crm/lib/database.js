const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'contacts.db');
const db = new Database(dbPath);

// Create contacts table if it doesn't exist
const createContactsTable = `
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT,
    tags TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createContactsTable);

// Prepared statements for better performance
const insertContact = db.prepare(`
  INSERT INTO contacts (firstName, lastName, email, phone, source, tags, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const getAllContacts = db.prepare('SELECT * FROM contacts ORDER BY createdAt DESC');
const getContactById = db.prepare('SELECT * FROM contacts WHERE id = ?');

const updateContact = db.prepare(`
  UPDATE contacts 
  SET firstName = ?, lastName = ?, email = ?, phone = ?, source = ?, tags = ?, notes = ?
  WHERE id = ?
`);

const deleteContact = db.prepare('DELETE FROM contacts WHERE id = ?');

const searchContacts = db.prepare(`
  SELECT * FROM contacts 
  WHERE (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR tags LIKE ? OR source LIKE ?)
  ORDER BY createdAt DESC
`);

module.exports = {
  db,
  insertContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  searchContacts
};