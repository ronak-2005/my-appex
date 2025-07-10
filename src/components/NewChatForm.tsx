'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewChatForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [goals, setGoals] = useState('');
  const [domain, setDomain] = useState('');
  const [experience, setExperience] = useState('');

const getCurrentUserId = async () => {
  try {
    console.log('🔍 Calling verify-token endpoint...');
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
    const response = await fetch('http://localhost:5000/api/verify-token', {
      method: 'GET',
      credentials: 'include'
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('📦 Full response data:', data);
      console.log('👤 UserId from response:', data.userId);
      console.log('👤 Username from response:', data.username);
      
      return data.userId;
    } else if (response.status === 401) {
      console.log('🔒 Token expired, attempting refresh...');
      
      // Try to refresh the token
      const refreshResponse = await fetch('http://localhost:5000/api/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (refreshResponse.ok) {
        console.log('✅ Token refreshed successfully');
      
        const retryResponse = await fetch(`${apiUrl}/api/verify-token`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          return retryData.userId;
        }
      }
      
      // If refresh fails, redirect to login
      alert('Your session has expired. Please log in again.');
      router.push('/login');
      return null;
    }
    return null;
  } catch (error) {
    console.error('❌ Error in getCurrentUserId:', error);
    return null;
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique user ID for this session
      const uniqueUserId = await getCurrentUserId();

      if (!uniqueUserId) {
        alert('Unable to verify authentication. Please log in again.');
        router.push('/login');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const chatData = {
        title: goals || 'New Career Chat',
        name,
        email,
        skills: skills.split(',').map((s) => s.trim()).filter(s => s.length > 0),
        goals,  // ✅ This is required by your backend
        domain,
        experience
        // ❌ Remove: userId, archived, createdAt, messages
        // Backend gets userId from JWT token and creates these fields automatically
      };
      console.log('Creating chat with data:', chatData);
      console.log('API URL:', apiUrl);

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
                    'Accept':'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(chatData),
      });
      console.log('Chat creation response status:', response.status);
      console.log('Chat creation response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Chat creation error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Chat created successfully:', data);
      
      const chatId = data.chatId || data.chat_id || data._id;
      if (chatId) {
        router.push(`/start/chat/${chatId}`);
      } else {
        throw new Error('No chat ID returned from server');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Network error occurred. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Start New Career Chat
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g., JavaScript, React, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Separate multiple skills with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Career Goals
            </label>
            <textarea
              required
              placeholder="What are your career goals?"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Preferred Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a domain</option>
              <option value="frontend">Frontend Development</option>
              <option value="backend">Backend Development</option>
              <option value="fullstack">Full Stack Development</option>
              <option value="data">Data Science</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="mobile">Mobile Development</option>
              <option value="devops">DevOps</option>
              <option value="design">UI/UX Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3+ years)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Chat...
              </>
            ) : (
              'Start Career Chat'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm transition duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

