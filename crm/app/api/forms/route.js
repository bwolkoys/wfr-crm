import Database from '../../../lib/database';

const db = new Database();

export async function GET() {
  try {
    const forms = await db.getForms();
    return Response.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return Response.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name) {
      return Response.json({ error: 'Form name is required' }, { status: 400 });
    }

    const form = await db.createForm({
      name: formData.name,
      description: formData.description,
      fields: formData.fields,
      tags: formData.tags,
      created_at: new Date().toISOString()
    });

    return Response.json(form, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return Response.json({ error: 'Failed to create form' }, { status: 500 });
  }
}