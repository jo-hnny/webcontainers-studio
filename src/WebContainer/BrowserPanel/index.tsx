import { useEffect, useRef, useState } from 'react';
import { webcontainerInstancePromise } from '../core';

export function BrowserPanel() {
  const [src, setSrc] = useState('');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function init() {
      const webcontainerInstance = await webcontainerInstancePromise;

      webcontainerInstance.on('server-ready', (port, url) => {
        setSrc(url);

        if (iframeRef.current) {
          iframeRef.current.contentWindow?.location.reload();
        }
      });
    }

    init();
  }, []);

  return (
    <iframe
      title="test"
      ref={iframeRef}
      style={{ width: '100%', height: '100%' }}
      src={src}
    />
  );
}
