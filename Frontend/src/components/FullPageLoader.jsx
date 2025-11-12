import React from 'react';
// 1. Purane 'Spinner' ki jagah 'LogoSpinner' import karo
import LogoSpinner from './LogoSpinner.jsx'; 

function FullPageLoader() {
  return (
    // Yeh div poori screen ko cover karega aur spinner ko center mein rakhega
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* 2. Yahan component badal do */}
      <LogoSpinner />
    </div>
  );
}

export default FullPageLoader;