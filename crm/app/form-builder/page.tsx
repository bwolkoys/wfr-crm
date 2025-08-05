'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'date' | 'number' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  name: string;
  description: string;
  fields: FormField[];
  tags: string[];
}

export default function FormBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    fields: [
      { id: '1', type: 'text', label: 'First Name', placeholder: 'Enter first name', required: true },
      { id: '2', type: 'text', label: 'Last Name', placeholder: 'Enter last name', required: true },
      { id: '3', type: 'email', label: 'Email', placeholder: 'Enter email address', required: true },
      { id: '4', type: 'phone', label: 'Phone', placeholder: 'Enter phone number', required: true },
    ],
    tags: []
  });

  const [loading, setLoading] = useState(false);

  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    placeholder: '',
    required: false
  });

  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (editId) {
      loadFormData(editId);
    }
  }, [editId]);

  const loadFormData = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${id}`);
      if (response.ok) {
        const form = await response.json();
        setFormData({
          name: form.name,
          description: form.description || '',
          fields: form.fields,
          tags: form.tags || []
        });
      }
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Error loading form data');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (fieldId: string, property: keyof FormField, value: any) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? { ...field, [property]: value }
          : field
      )
    }));
  };

  const addField = () => {
    if (!newField.label) return;
    
    const field: FormField = {
      id: Date.now().toString(),
      type: newField.type as FormField['type'],
      label: newField.label,
      placeholder: newField.placeholder || '',
      required: newField.required || false,
      options: newField.type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));

    setNewField({
      type: 'text',
      label: '',
      placeholder: '',
      required: false
    });
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (tagIndex: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== tagIndex)
    }));
  };

  const saveForm = async () => {
    setLoading(true);
    try {
      const url = editId ? `/api/forms/${editId}` : '/api/forms';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/forms');
      } else {
        alert('Error saving form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form');
    } finally {
      setLoading(false);
    }
  };

  if (loading && editId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {editId ? 'Edit Form' : 'Form Builder'}
          </h1>
          <p className="text-gray-600">
            {editId ? 'Edit your existing form' : 'Create custom forms for Wix integration'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Builder */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Form Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter form name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Describe the purpose of this form"
                  />
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
              
              <div className="space-y-3 mb-4">
                {formData.fields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{field.label}</span>
                          {field.required && <span className="text-red-500 text-xs">*</span>}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{field.type}</div>
                      </div>
                      {index >= 4 && (
                        <button
                          onClick={() => removeField(field.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {/* Field Configuration */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="Field label"
                      />
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="Placeholder text"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, 'type', e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded flex-1 mr-2"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="textarea">Textarea</option>
                        <option value="date">Date</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                      </select>
                      
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-700">Required</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add Custom Field</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as FormField['type'] }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="date">Date</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                  </select>
                  
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Field label"
                  />
                </div>
                
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={newField.placeholder}
                    onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Placeholder text"
                  />
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                </div>
                
                <button
                  onClick={addField}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Field
                </button>
              </div>
            </div>

            {/* Auto-tagging */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Auto-tagging</h2>
              <p className="text-sm text-gray-600 mb-4">
                Contacts created from this form will automatically receive these tags:
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tag name"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Form Preview</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
              
              {showPreview && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">{formData.name || 'Untitled Form'}</h3>
                  {formData.description && (
                    <p className="text-gray-600 mb-4">{formData.description}</p>
                  )}
                  
                  <div className="space-y-4">
                    {formData.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            disabled
                          />
                        ) : field.type === 'select' ? (
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                            <option>Select an option</option>
                            {field.options?.map((option, idx) => (
                              <option key={idx}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Wix Integration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Wix Integration</h2>
              <p className="text-sm text-gray-600 mb-4">
                Once saved, you'll get code to embed this form in Wix and a webhook URL for automatic submissions.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={saveForm}
                  disabled={!formData.name || loading}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : (editId ? 'Update Form' : 'Save Form & Generate Integration Code')}
                </button>
                
                <button
                  onClick={() => router.push('/forms')}
                  className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View All Forms
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}