import { NextResponse } from 'next/server';
const { insertContact, getAllContacts, searchContacts } = require('../../../lib/database');

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
    const result = insertContact.run(
      firstName,
      lastName,
      email || null,
      phone || null,
      source || null,
      tags || null,
      notes || null
    );

    return NextResponse.json(
      { 
        message: 'Contact created successfully',
        id: result.lastInsertRowid
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
      const searchTerm = `%${query}%`;
      contacts = searchContacts.all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    } else {
      contacts = getAllContacts.all();
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