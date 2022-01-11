import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Legacy() {
  const history = useHistory();

  const legacyContent = useRef<HTMLIFrameElement>(null);
  const [legacyPath, setLegacyPath] = useState<string>(
    history.location.pathname.split(/\/legacy/)[1]
  );

  useEffect(() => {
    if (legacyContent.current) {
      legacyContent.current.setAttribute('src', legacyPath);
    }
    // Intentially not including legacyPath in the dependency list.
    // This is because updating legacyPath will cause the iframe to reload.
    // We don't want to reload the iframe if the path hasn't changed.
    // These updates are instead handled by the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyContent]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const loc = legacyContent.current?.contentWindow?.location.pathname;
      if (loc !== legacyPath && loc !== undefined) {
        history.push(`/legacy${loc}`);
        setLegacyPath(loc);
      }
    }, 200);
    return () => {
      clearInterval(checkInterval);
    };
  }, [history, legacyContent, legacyPath]);
  return (
    <section>
      <iframe
        ref={legacyContent}
        title="Legacy Content"
        width="100%"
        height="1000vh"
      />
    </section>
  );
}
