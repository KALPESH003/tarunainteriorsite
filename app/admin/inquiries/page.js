// app/admin/inquiries/page.js
import React from 'react';
import { connectToDatabase } from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry';
import { Mail, Phone, Calendar } from 'lucide-react';

// Force the page to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function AdminInquiries() {
  // 1. Connect to DB and fetch the data directly inside the Server Component!
  await connectToDatabase();
  const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Lead Management</h2>
          <p className="text-sm text-gray-500 mt-1">Review and manage incoming project requests.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 font-semibold">Client Detail</th>
                <th className="px-6 py-4 font-semibold">Project Spec</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <tr key={inq._id.toString()} className="hover:bg-gray-50 transition-colors">
                  {/* Notice we use inq._id.toString() because MongoDB uses an ObjectId format */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-sm">{inq.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inq.email}</span>
                      {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inq.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800 text-sm">{inq.projectType}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{inq.message}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {/* Formatting the MongoDB timestamp */}
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" /> 
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      inq.status === 'New' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      inq.status === 'Contacted' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}