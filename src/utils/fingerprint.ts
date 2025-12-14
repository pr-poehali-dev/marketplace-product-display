export const generateFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    localStorage.getItem('visitor_id') || Math.random().toString(36)
  ];
  
  const fingerprint = components.join('|');
  const hash = Array.from(fingerprint)
    .reduce((hash, char) => {
      const chr = char.charCodeAt(0);
      hash = ((hash << 5) - hash) + chr;
      return hash & hash;
    }, 0);
  
  const fingerprintId = `fp_${Math.abs(hash).toString(36)}`;
  
  if (!localStorage.getItem('visitor_id')) {
    localStorage.setItem('visitor_id', fingerprintId);
  }
  
  return fingerprintId;
};

export const getAdminFingerprint = (): string => {
  const adminUser = localStorage.getItem('adminUser');
  if (adminUser) {
    return `admin_${JSON.parse(adminUser).email}`;
  }
  return '';
};
