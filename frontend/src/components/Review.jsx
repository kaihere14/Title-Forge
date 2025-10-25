


import React from 'react';

export default function TestimonialCard() {
  return (
    <div className="w-full bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 font-sans">
      {/* Profile Image */}
      <div className="mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          <img 
            src="https://i.pinimg.com/736x/c4/71/c7/c471c7296fc3c4a1adf7c3d9dccd1b7d.jpg
" 
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Testimonial Quote */}
      <blockquote className="mb-6">
        <p className="text-xl leading-relaxed text-gray-900 font-normal">
          "After using the TitleForge, my video views increased by 78%. The AI-powered suggestions transformed my generic titles into compelling headlines that actually get clicks. What used to get 3K views now consistently hits 5-6K. This tool made a real difference in my channel's performance."
        </p>
      </blockquote>

      {/* Author Info */}
      <div className="border-t border-gray-300 pt-6">
        <p className="text-lg font-medium text-gray-900 mb-1">Marcus Rodriguez</p>
        <p className="text-sm text-gray-600">Tech Review Creator, 450K Subscribers</p>
      </div>

      {/* Stats Badge */}
      <div className="mt-8 inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-semibold text-gray-900">+78% Views</span>
        </div>
        <span className="text-gray-400">•</span>
        <span className="text-base text-gray-600">in 3 months</span>
      </div>
    </div>
  );
}