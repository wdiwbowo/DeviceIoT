import React from 'react';

export default function App() {
  return (
    <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center min-h-screen'>
      <div className="bg-gray-800 border-t-4 border-purple-600 shadow-lg rounded-lg max-w-lg w-full p-8">
        <h4 className='text-white text-3xl mb-4 font-semibold'>Welcome</h4>
        <p className='text-lg text-gray-400 leading-relaxed mb-6'>
          Selamat datang di aplikasi kami! Mari lanjutkan perjalanan Anda ke halaman berikutnya.
        </p>
        <a
          href="/device"
          className="inline-block border border-purple-600 text-purple-600 hover:text-white hover:bg-purple-600 py-3 px-6 rounded-lg transition duration-300 ease-in-out"
        >
          Lanjut ke halaman berikutnya
        </a>
      </div>
    </div>
  );
}
