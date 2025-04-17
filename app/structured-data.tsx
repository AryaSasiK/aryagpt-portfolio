import React from 'react';

export default function StructuredData() {
  // Create JSON-LD for person (Arya Sasikumar)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Arya Sasikumar",
    "url": "https://aryasasikumar.com",
    "image": "https://aryasasikumar.com/images/profile.png",
    "sameAs": [
      // Add social media profiles if available
      "https://linkedin.com/in/aryasasikumar",
      "https://github.com/aryasasik",
      "https://instagram.com/aryasasik"
    ],
    "jobTitle": "Robotics Engineer & Entrepreneur", // Replace with actual job title
    "description": "Interactive AI-powered portfolio of Arya Sasikumar, showcasing professional experience, projects, and skills.",
    "gender": "Male", // Adjust as appropriate
    "alumniOf": [
      {
        "@type": "University",
        "name": "University of California, Berkeley"
      }
    ],
    "knowsAbout": ["Entrepreneurship", "Robotics", "Artificial Intelligence", "UC Berkeley M.E.T."],
    "worksFor": {
      "@type": "Organization",
      "name": "Robolabs" // Replace with actual company
    }
  };

  // Create JSON-LD for website
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Arya Sasikumar | AryaGPT Interactive Portfolio",
    "url": "https://aryasasikumar.com",
    "description": "Interactive AI portfolio of Arya Sasikumar showcasing professional experience, projects, and skills through a conversational interface.",
    "author": {
      "@type": "Person",
      "name": "Arya Sasikumar"
    }
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} 
      />
    </>
  );
} 