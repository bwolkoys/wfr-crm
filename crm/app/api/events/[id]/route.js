import { NextResponse } from 'next/server';
const DatabaseManager = require('../../../../lib/database');
const db = new DatabaseManager();

export async function GET(request, { params }) {
  try {
    const event = db.getEvent(params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { title, description, date, type, client_name, google_event_id } = body;

    // Check if event exists
    const existingEvent = db.getEvent(params.id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

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

    // Update event in database
    const updatedEvent = db.updateEvent(params.id, {
      title,
      description,
      date,
      type,
      client_name,
      google_event_id
    });

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check if event exists
    const existingEvent = db.getEvent(params.id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete event from database
    db.deleteEvent(params.id);

    return NextResponse.json({
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}