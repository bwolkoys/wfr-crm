import { NextResponse } from 'next/server';
const DatabaseManager = require('../../../lib/database');
const db = new DatabaseManager();

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, source, tags, notes } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Insert contact into database
    const contact = db.createContact({
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      source: source || null,
      tags: tags || null,
      notes: notes || null
    });

    return NextResponse.json(
      { 
        message: 'Contact created successfully',
        id: contact.id,
        contact
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('search');

    let contacts;
    if (query) {
      contacts = db.searchContacts(query);
    } else {
      contacts = db.getAllContacts();
    }

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}