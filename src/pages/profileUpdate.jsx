import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ProfileForm = () => {
  const [bio, setBio] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    linkedin: ''
  });

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!bio.trim() || !coverImage.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please provide both bio and cover image.',
        confirmButtonColor: '#f59e0b',
      });
    }

    const profileData = {
      bio,
      coverImage,
      socialLinks
    };

    try {
      const response = await fetch('https://insurances-lmy8.onrender.com/profiledesign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || 'Unknown server error');
      }

      Swal.fire({
        icon: 'success',
        title: 'Profile Submitted',
        text: 'Your profile has been submitted successfully!',
        confirmButtonColor: '#4f46e5'
      });

      // Reset form
      setBio('');
      setCoverImage('');
      setSocialLinks({ facebook: '', twitter: '', linkedin: '' });
    } catch (error) {
      console.error('Submission Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.message || 'Please try again later.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 bg-white shadow rounded">
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Your bio"
        className="w-full border px-3 py-2 rounded"
        rows="3"
        required
      />
      <input
        type="text"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        placeholder="Cover image URL"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="facebook"
        value={socialLinks.facebook}
        onChange={handleSocialChange}
        placeholder="Facebook URL"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        name="twitter"
        value={socialLinks.twitter}
        onChange={handleSocialChange}
        placeholder="Twitter URL"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        name="linkedin"
        value={socialLinks.linkedin}
        onChange={handleSocialChange}
        placeholder="LinkedIn URL"
        className="w-full border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  );
};

export default ProfileForm;