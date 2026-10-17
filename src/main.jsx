import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Seamless handover: smoothly dismiss 0ms telemetry preloader once React bundle mounts
const preloader = document.getElementById('telemetry-preloader');
if (preloader) {
  preloader.classList.add('fade-out');
  setTimeout(() => {
    if (preloader && preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }
  }, 450);
}
