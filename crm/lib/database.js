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

// Create forms table if it doesn't exist
const createFormsTable = `
  CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    fields TEXT NOT NULL,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Create form_submissions table if it doesn't exist
const createFormSubmissionsTable = `
  CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    submission_data TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms (id),
    FOREIGN KEY (contact_id) REFERENCES contacts (id)
  )
`;

db.exec(createFormsTable);
db.exec(createFormSubmissionsTable);

// Create events table if it doesn't exist
const createEventsTable = `
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('booked', 'blocked', 'tentative')),
    client_name TEXT,
    google_event_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createEventsTable);

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

const getContactByEmail = db.prepare('SELECT * FROM contacts WHERE email = ?');

// Form-related prepared statements
const insertForm = db.prepare(`
  INSERT INTO forms (name, description, fields, tags, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const getAllForms = db.prepare('SELECT * FROM forms ORDER BY created_at DESC');
const getFormById = db.prepare('SELECT * FROM forms WHERE id = ?');

const updateForm = db.prepare(`
  UPDATE forms 
  SET name = ?, description = ?, fields = ?, tags = ?, updated_at = ?
  WHERE id = ?
`);

const deleteForm = db.prepare('DELETE FROM forms WHERE id = ?');

// Form submission prepared statements
const insertFormSubmission = db.prepare(`
  INSERT INTO form_submissions (form_id, contact_id, submission_data, submitted_at)
  VALUES (?, ?, ?, ?)
`);

const getFormSubmissions = db.prepare(`
  SELECT fs.*, f.name as form_name, c.firstName, c.lastName, c.email
  FROM form_submissions fs
  JOIN forms f ON fs.form_id = f.id
  JOIN contacts c ON fs.contact_id = c.id
  ORDER BY fs.submitted_at DESC
`);

// Event-related prepared statements
const insertEvent = db.prepare(`
  INSERT INTO events (title, description, date, type, client_name, google_event_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getAllEvents = db.prepare('SELECT * FROM events ORDER BY date ASC');
const getEventById = db.prepare('SELECT * FROM events WHERE id = ?');

const updateEvent = db.prepare(`
  UPDATE events 
  SET title = ?, description = ?, date = ?, type = ?, client_name = ?, google_event_id = ?, updated_at = ?
  WHERE id = ?
`);

const deleteEvent = db.prepare('DELETE FROM events WHERE id = ?');

const getEventsByDateRange = db.prepare(`
  SELECT * FROM events 
  WHERE date >= ? AND date <= ?
  ORDER BY date ASC
`);

class DatabaseManager {
  // Contact methods
  getAllContacts() {
    return getAllContacts.all();
  }

  getContact(id) {
    return getContactById.get(id);
  }

  getContactByEmail(email) {
    return getContactByEmail.get(email);
  }

  createContact(contactData) {
    const result = insertContact.run(
      contactData.first_name || contactData.firstName,
      contactData.last_name || contactData.lastName,
      contactData.email,
      contactData.phone,
      contactData.source || 'Form Submission',
      contactData.tags || '',
      contactData.notes || ''
    );
    return this.getContact(result.lastInsertRowid);
  }

  updateContact(id, contactData) {
    updateContact.run(
      contactData.first_name || contactData.firstName,
      contactData.last_name || contactData.lastName,
      contactData.email,
      contactData.phone,
      contactData.source,
      contactData.tags,
      contactData.notes,
      id
    );
    return this.getContact(id);
  }

  deleteContact(id) {
    return deleteContact.run(id);
  }

  searchContacts(query) {
    const searchTerm = `%${query}%`;
    return searchContacts.all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  // Form methods
  getForms() {
    const forms = getAllForms.all();
    return forms.map(form => ({
      ...form,
      fields: JSON.parse(form.fields),
      tags: form.tags ? form.tags.split(',') : []
    }));
  }

  getForm(id) {
    const form = getFormById.get(id);
    if (!form) return null;
    
    return {
      ...form,
      fields: JSON.parse(form.fields),
      tags: form.tags ? form.tags.split(',') : []
    };
  }

  createForm(formData) {
    const result = insertForm.run(
      formData.name,
      formData.description,
      JSON.stringify(formData.fields),
      Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags,
      formData.created_at,
      formData.created_at
    );
    return this.getForm(result.lastInsertRowid);
  }

  updateForm(id, formData) {
    updateForm.run(
      formData.name,
      formData.description,
      JSON.stringify(formData.fields),
      Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags,
      new Date().toISOString(),
      id
    );
    return this.getForm(id);
  }

  deleteForm(id) {
    return deleteForm.run(id);
  }

  // Form submission methods
  createFormSubmission(submissionData) {
    const result = insertFormSubmission.run(
      submissionData.form_id,
      submissionData.contact_id,
      submissionData.submission_data,
      submissionData.submitted_at
    );
    return { id: result.lastInsertRowid, ...submissionData };
  }

  getFormSubmissions() {
    return getFormSubmissions.all();
  }

  // Event methods
  getAllEvents() {
    return getAllEvents.all();
  }

  getEvent(id) {
    return getEventById.get(id);
  }

  createEvent(eventData) {
    const now = new Date().toISOString();
    const result = insertEvent.run(
      eventData.title,
      eventData.description || null,
      eventData.date,
      eventData.type,
      eventData.client_name || null,
      eventData.google_event_id || null,
      now,
      now
    );
    return this.getEvent(result.lastInsertRowid);
  }

  updateEvent(id, eventData) {
    const now = new Date().toISOString();
    updateEvent.run(
      eventData.title,
      eventData.description || null,
      eventData.date,
      eventData.type,
      eventData.client_name || null,
      eventData.google_event_id || null,
      now,
      id
    );
    return this.getEvent(id);
  }

  deleteEvent(id) {
    return deleteEvent.run(id);
  }

  getEventsByDateRange(startDate, endDate) {
    return getEventsByDateRange.all(startDate, endDate);
  }
}

module.exports = DatabaseManager;