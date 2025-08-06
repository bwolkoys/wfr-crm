import { NextResponse } from 'next/server';
const DatabaseManager = require('../../../lib/database');
const db = new DatabaseManager();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let events;
    if (startDate && endDate) {
      events = db.getEventsByDateRange(startDate, endDate);
    } else {
      events = db.getAllEvents();
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, date, type, client_name, google_event_id } = body;

    // Validate required fields
    if (!title || !date || !type) {
      return NextResponse.json(
        { error: 'Title, date, and type are required' },
        { status: 400 }
      );
    }

    // Validate event type
    if (!['booked', 'blocked', 'tentative'].includes(type)) {
      return NextResponse.json(
        { error: 'Event type must be booked, blocked, or tentative' },
        { status: 400 }
      );
    }

    // Create event in database
    const event = db.createEvent({
      title,
      description,
      date,
      type,
      client_name,
      google_event_id
    });

    return NextResponse.json(
      { 
        message: 'Event created successfully',
        event
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}