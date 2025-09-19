import React, { useState } from 'react';

const ClaimsSection = () => {
  const [claimId, setClaimId] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async (e) => {
    e.preventDefault();

    if (!claimId.trim()) {
      setStatus({ type: 'error', message: '❌ Please enter a valid claim ID' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock status check with more realistic claim IDs
    const claimData = {
      'CL001': { status: 'approved', message: '✅ Your claim has been approved and payment is being processed.' },
      'CL002': { status: 'pending', message: '⏳ Your claim is under review. Expected completion: 3-5 business days.' },
      'CL003': { status: 'rejected', message: '❌ Your claim has been rejected. Please contact support for details.' },
      'CL004': { status: 'processing', message: '🔄 Your claim is being processed. We will update you soon.' }
    };

    const result = claimData[claimId.toUpperCase()];
    
    if (result) {
      setStatus({ type: result.status, message: result.message });
    } else {
      setStatus({ type: 'error', message: '❌ Claim ID not found. Please check your ID and try again.' });
    }

    setIsLoading(false);
  };

  return ( 
    <section className="p-6 mt-5 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">📝 Claims Section</h2>

        {/* How to Claim */}
        <div className="bg-white rounded-lg shadow-lg mb-8 p-6 border-l-4 border-blue-500">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            📋 How to Claim
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">Steps (English):</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Gather your policy number and required documents</li>
                <li>Fill out our claim form (download below)</li>
                <li>Submit form and documents to our office or email</li>
                <li>Check status using the checker below</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">ধাপসমূহ (বাংলা):</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>আপনার পলিসি নম্বর এবং প্রয়োজনীয় ডকুমেন্ট সংগ্রহ করুন</li>
                <li>আমাদের ক্লেইম ফর্ম পূরণ করুন (নিচে ডাউনলোড করুন)</li>
                <li>ফর্ম ও ডকুমেন্ট অফিসে জমা দিন বা ইমেইল করুন</li>
                <li>স্টেটাস চেক করুন নিচের ফর্মে</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-lg shadow-lg mb-8 p-6 border-l-4 border-green-500">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            📄 Required Documents
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Policy Certificate</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Medical Reports (if applicable)</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>National ID Card</li>
            </ul>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Bank Account Details</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Incident Report (if applicable)</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Photographs (if applicable)</li>
            </ul>
          </div>
        </div>

        {/* Download Claim Form */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">📥 Download Claim Form</h3>
            <p className="text-gray-600 mb-4">Download the official claim form and fill it out completely</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                📄 Download Form (PDF)
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                📝 Fill Online Form
              </button>
            </div>
          </div>
        </div>

        {/* Check Claim Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            🔍 Check Claim Status
          </h3>
          <p className="text-gray-600 mb-4">Enter your claim ID to check the current status</p>
          
          {/* Demo Claim IDs */}
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Claim IDs (for testing):</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">CL001 (Approved)</span>
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">CL002 (Pending)</span>
              <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">CL003 (Rejected)</span>
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">CL004 (Processing)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Enter your Claim ID (e.g., CL001)" 
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
              />
              <button 
                onClick={checkStatus}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center min-w-32"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Checking...
                  </div>
                ) : (
                  'Check Status'
                )}
              </button>
            </div>
          </div>
          
          {status && (
            <div className={`mt-4 p-4 rounded-lg border-l-4 ${
              status.type === 'approved' ? 'bg-green-50 border-green-500 text-green-800' :
              status.type === 'pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
              status.type === 'processing' ? 'bg-blue-50 border-blue-500 text-blue-800' :
              'bg-red-50 border-red-500 text-red-800'
            }`}>
              <div className="flex items-start">
                <span className="text-lg mr-2">
                  {status.type === 'approved' ? '✅' : 
                   status.type === 'pending' ? '⏳' :
                   status.type === 'processing' ? '🔄' : '❌'}
                </span>
                <div>
                  <p className="font-medium">{status.message}</p>
                  {status.type === 'approved' && (
                    <p className="text-sm mt-1">Payment will be credited to your account within 2-3 business days.</p>
                  )}
                  {status.type === 'rejected' && (
                    <p className="text-sm mt-1">Contact our support team at +880-1234-567890 for assistance.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">📞 Need Help?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-600">
            <span>📧 claims@insurance.com</span>
            <span>📱 +880-1234-567890</span>
            <span>🕒 Mon-Fri: 9AM-6PM</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaimsSection;