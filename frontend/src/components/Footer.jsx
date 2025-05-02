import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 pt-8 pb-8">
      © {new Date().getFullYear()} Sangs. All rights reserved.
    </footer>
  );
}

export default Footer;
