// src/ProfilePCompo.js
import React from 'react';

const ProfilePCompo = () => {
  const user = {
    name: 'John Doe',
    bio: 'Web Developer and Tech Enthusiast',
    image: 'https://source.unsplash.com/random/200x200/?profile' // Placeholder image
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto">
          <h1 className="text-white text-xl font-bold">My Profile</h1>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="flex items-center justify-center mt-16">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
          <img
            src={user.image}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-blue-600"
          />
          <h2 className="mt-4 text-2xl font-semibold">{user.name}</h2>
          <p className="mt-2 text-gray-600">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePCompo;
