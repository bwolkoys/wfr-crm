import { NextResponse } from 'next/server';
const { getContactById, updateContact, deleteContact } = require('../../../../lib/database');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const contact = getContactById.get(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, email, phone, source, tags, notes } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Update contact in database
    const result = updateContact.run(
      firstName,
      lastName,
      email || null,
      phone || null,
      source || null,
      tags || null,
      notes || null,
      id
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Contact updated successfully',
      id: id
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const result = deleteContact.run(id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Contact deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}