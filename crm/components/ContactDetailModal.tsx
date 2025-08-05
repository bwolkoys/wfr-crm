'use client';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  tags: string;
  notes: string;
  createdAt: string;
}

interface ContactDetailModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContactDetailModal({ 
  contact, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: ContactDetailModalProps) {
  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="text-gray-600 mt-1">Contact Details</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  First Name
                </label>
                <p className="text-lg text-gray-900">{contact.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Last Name
                </label>
                <p className="text-lg text-gray-900">{contact.lastName}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-lg text-blue-600 hover:text-blue-800"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <p className="text-lg text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-lg text-blue-600 hover:text-blue-800"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <p className="text-lg text-gray-400">Not provided</p>
                )}
              </div>
            </div>

            {/* Source and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Source
                </label>
                {contact.source ? (
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {contact.source}
                  </span>
                ) : (
                  <p className="text-lg text-gray-400">Not specified</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tags
                </label>
                {contact.tags ? (
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-gray-400">No tags</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Notes
              </label>
              {contact.notes ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              ) : (
                <p className="text-lg text-gray-400">No notes</p>
              )}
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created
              </label>
              <p className="text-gray-900">
                {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Contact
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}