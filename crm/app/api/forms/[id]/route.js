import Database from '../../../../lib/database';

const db = new Database();

export async function GET(request, { params }) {
  try {
    const form = await db.getForm(params.id);
    if (!form) {
      return Response.json({ error: 'Form not found' }, { status: 404 });
    }
    return Response.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    return Response.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const formData = await request.json();
    const form = await db.updateForm(params.id, formData);
    return Response.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    return Response.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await db.deleteForm(params.id);
    return Response.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return Response.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}