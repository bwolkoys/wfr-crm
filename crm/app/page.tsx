'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContactForm from '../components/ContactForm';

export default function Dashboard() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const handleContactSuccess = () => {
    // You can add any success handling here, like showing a toast
    console.log('Contact created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Weedon Family Ranch CRM
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ranch Life Elevated
          </p>
        </div>

        {/* Dashboard Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">📧</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New Submissions</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$45,2K</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Actions */}
        <div className="space-y-8">
          {/* Contact Management */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button 
                onClick={() => setIsContactFormOpen(true)}
                className="bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-blue-600 text-lg">➕</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Add New Contact</div>
                  <div className="text-sm text-gray-500">Create contact profiles</div>
                </div>
              </button>
              
              <Link 
                href="/contacts"
                className="bg-white hover:bg-gray-50 border-2 border-green-200 hover:border-green-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-green-600 text-lg">👥</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">View All Contacts</div>
                  <div className="text-sm text-gray-500">Browse contact directory</div>
                </div>
              </Link>
              
            </div>
          </div>

          {/* Communications */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Communications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-white hover:bg-gray-50 border-2 border-red-200 hover:border-red-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group">
                <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-red-600 text-lg">📧</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Send Email Campaign</div>
                  <div className="text-sm text-gray-500">Create and send newsletters</div>
                </div>
              </button>
              
              <button className="bg-white hover:bg-gray-50 border-2 border-purple-200 hover:border-purple-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group">
                <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-purple-600 text-lg">📋</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">New Form Submissions</div>
                  <div className="text-sm text-gray-500">Review contact form entries</div>
                </div>
              </button>
            </div>
          </div>

          {/* Business Operations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-white hover:bg-gray-50 border-2 border-indigo-200 hover:border-indigo-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group">
                <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-indigo-600 text-lg">💰</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">View Payments</div>
                  <div className="text-sm text-gray-500">Track financial transactions</div>
                </div>
              </button>
              
              <button className="bg-white hover:bg-gray-50 border-2 border-teal-200 hover:border-teal-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group">
                <div className="w-10 h-10 bg-teal-100 group-hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-teal-600 text-lg">📅</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Upcoming Events</div>
                  <div className="text-sm text-gray-500">View scheduled activities</div>
                </div>
              </button>

              <Link 
                href="/form-builder"
                className="bg-white hover:bg-gray-50 border-2 border-orange-200 hover:border-orange-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-orange-600 text-lg">🏷️</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Create A Form</div>
                  <div className="text-sm text-gray-500">Create Forms to Add to Wix</div>
                </div>
              </Link>

              <Link 
                href="/forms"
                className="bg-white hover:bg-gray-50 border-2 border-yellow-200 hover:border-yellow-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-yellow-100 group-hover:bg-yellow-200 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-yellow-600 text-lg">📋</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">View All Forms</div>
                  <div className="text-sm text-gray-500">Browse and manage forms</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
          onSuccess={handleContactSuccess}
        />
      </div>
    </div>
  );
}
