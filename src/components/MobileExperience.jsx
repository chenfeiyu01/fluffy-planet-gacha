import React, { useEffect, useState } from 'react';

// An actual narrow viewport keeps fixed layers, dialogs and media queries mobile.
export default function MobileExperience({ children }) {
  const [desktop, setDesktop] = useState(() => window.self === window.top && matchMedia('(min-width: 761px)').matches);
  const [scale, setScale] = useState(() => Math.min(1, (window.innerHeight - 32) / 866, (window.innerWidth - 32) / 412));
  useEffect(() => {
    const query = matchMedia('(min-width: 761px)');
    const update = () => setDesktop(window.self === window.top && query.matches);
    const resize = () => setScale(Math.min(1, (window.innerHeight - 32) / 866, (window.innerWidth - 32) / 412));
    query.addEventListener('change', update);
    window.addEventListener('resize', resize);
    return () => {
      query.removeEventListener('change', update);
      window.removeEventListener('resize', resize);
    };
  }, []);
  if (!desktop) return children;
  return <main className="phone-preview">
    <div className="phone-stage" style={{ width: 412 * scale, height: 866 * scale }}>
      <div className="phone-device" style={{ transform: `scale(${scale})` }}>
        <div className="phone-screen">
          <iframe src={window.location.href} title="绒绒星球手机版" allow="autoplay; fullscreen" />
        </div>
      </div>
    </div>
  </main>;
}
