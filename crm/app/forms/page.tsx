'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
}

interface Form {
  id: number;
  name: string;
  description: string;
  fields: FormField[];
  tags: string[];
  created_at: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showWixCode, setShowWixCode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId: number) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setForms(forms.filter(form => form.id !== formId));
      }
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const generateWixCode = (form: Form) => {
    const webhookUrl = `${window.location.origin}/api/webhook/form-submission`;
    
    const htmlForm = `
<!-- Wix Form HTML -->
<form id="crm-form-${form.id}" class="crm-contact-form">
  <input type="hidden" name="formId" value="${form.id}" />
  
  ${form.fields.map(field => {
    switch (field.type) {
      case 'textarea':
        return `
  <div class="form-field">
    <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
    <textarea 
      id="${field.id}" 
      name="${field.label.replace(/\s+/g, '')}" 
      placeholder="${field.placeholder || ''}"
      ${field.required ? 'required' : ''}
    ></textarea>
  </div>`;
      case 'select':
        return `
  <div class="form-field">
    <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
    <select 
      id="${field.id}" 
      name="${field.label.replace(/\s+/g, '')}"
      ${field.required ? 'required' : ''}
    >
      <option value="">Select an option</option>
      <option value="Option 1">Option 1</option>
      <option value="Option 2">Option 2</option>
    </select>
  </div>`;
      default:
        return `
  <div class="form-field">
    <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
    <input 
      type="${field.type}" 
      id="${field.id}" 
      name="${field.label.replace(/\s+/g, '')}" 
      placeholder="${field.placeholder || ''}"
      ${field.required ? 'required' : ''}
    />
  </div>`;
    }
  }).join('')}
  
  <button type="submit" class="submit-btn">Submit</button>
</form>

<style>
  .crm-contact-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .form-field {
    margin-bottom: 20px;
  }
  
  .form-field label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  
  .form-field input,
  .form-field textarea,
  .form-field select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .submit-btn {
    background: #007cba;
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
  
  .submit-btn:hover {
    background: #005a87;
  }
</style>`;

    const jsCode = `
<!-- JavaScript for Form Submission -->
<script>
document.getElementById('crm-form-${form.id}').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {};
  
  // Convert FormData to object
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  try {
    const response = await fetch('${webhookUrl}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: '${form.id}',
        data: data
      })
    });
    
    if (response.ok) {
      alert('Thank you! Your submission has been received.');
      e.target.reset();
    } else {
      alert('There was an error submitting your form. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error submitting your form. Please try again.');
  }
});
</script>`;

    return { htmlForm, jsCode, webhookUrl };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Forms</h1>
              <p className="text-gray-600">Manage your Wix integration forms</p>
            </div>
            <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
              <Link
                href="/form-builder"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Form
              </Link>
            </div>
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No forms yet</h2>
            <p className="text-gray-600 mb-6">Create your first form to get started with Wix integration</p>
            <Link
              href="/form-builder"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.name}</h3>
                {form.description && (
                  <p className="text-gray-600 mb-4">{form.description}</p>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">{form.fields.length} fields</p>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {form.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    Created: {new Date(form.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedForm(form);
                      setShowWixCode(true);
                    }}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Get Wix Code
                  </button>
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/form-builder?edit=${form.id}`}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wix Code Modal */}
        {showWixCode && selectedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Wix Integration Code: {selectedForm.name}
                  </h2>
                  <button
                    onClick={() => setShowWixCode(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Integration Instructions</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Copy the HTML code and paste it into your Wix page</li>
                    <li>2. Copy the JavaScript code and add it to your page</li>
                    <li>3. Test the form to ensure submissions are being received</li>
                    <li>4. Form submissions will automatically create/update contacts with the specified tags</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Webhook URL</h3>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <code className="text-sm">{generateWixCode(selectedForm).webhookUrl}</code>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">HTML Form Code</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{generateWixCode(selectedForm).htmlForm}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">JavaScript Code</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{generateWixCode(selectedForm).jsCode}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowWixCode(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}