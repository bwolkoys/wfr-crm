import Database from '../../../../lib/database';

const db = new Database();

export async function POST(request) {
  try {
    const submission = await request.json();
    
    // Validate required fields
    if (!submission.formId || !submission.data) {
      return Response.json({ error: 'Form ID and data are required' }, { status: 400 });
    }

    // Get form details to know which tags to apply
    const form = await db.getForm(submission.formId);
    if (!form) {
      return Response.json({ error: 'Form not found' }, { status: 404 });
    }

    // Extract contact information from submission data
    const contactData = {
      first_name: submission.data.firstName || submission.data['First Name'] || '',
      last_name: submission.data.lastName || submission.data['Last Name'] || '',
      email: submission.data.email || submission.data.Email || '',
      phone: submission.data.phone || submission.data.Phone || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Create or update contact
    let contact;
    if (contactData.email) {
      // Try to find existing contact by email
      const existingContact = await db.getContactByEmail(contactData.email);
      
      if (existingContact) {
        // Update existing contact
        contact = await db.updateContact(existingContact.id, {
          ...contactData,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new contact
        contact = await db.createContact(contactData);
      }
    } else {
      // Create new contact without email check
      contact = await db.createContact(contactData);
    }

    // Apply auto-tags from form
    if (form.tags && form.tags.length > 0) {
      const existingTags = contact.tags ? contact.tags.split(',') : [];
      const newTags = [...new Set([...existingTags, ...form.tags])];
      
      await db.updateContact(contact.id, {
        tags: newTags.join(',')
      });
    }

    // Store the full form submission
    const submissionRecord = await db.createFormSubmission({
      form_id: submission.formId,
      contact_id: contact.id,
      submission_data: JSON.stringify(submission.data),
      submitted_at: new Date().toISOString()
    });

    return Response.json({
      success: true,
      contact: contact,
      submission: submissionRecord
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing form submission:', error);
    return Response.json({ error: 'Failed to process form submission' }, { status: 500 });
  }
}