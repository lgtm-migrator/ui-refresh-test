import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Legacy() {
  const history = useHistory();

  const legacyContent = useRef<HTMLIFrameElement>(null);

  const initPath =
    history.location.pathname.split(/\/legacy/)[1] + history.location.hash;
  const [initialLegacyPath] = useState<string>(initPath);
  const [legacyPath, setLegacyPath] = useState<string>(initPath);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const location = legacyContent.current?.contentWindow?.location;
      if (location) {
        const loc = location.pathname + (location.hash ?? '');
        if (loc && loc !== legacyPath) {
          history.push(`/legacy${loc}`);
          setLegacyPath(loc);
        }
      }
    }, 200);
    return () => {
      clearInterval(checkInterval);
    };
  }, [history, legacyContent, legacyPath]);

  return (
    <section>
      <iframe
        src={initialLegacyPath}
        ref={legacyContent}
        title="Legacy Content"
        width="100%"
        height="1000vh"
      />
    </section>
  );
}
