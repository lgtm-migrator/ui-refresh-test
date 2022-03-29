import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const legacyPart = (path: string) =>
  path.match(/(?:\/legacy)+(\/.*)$/)?.[1] || '/';

/** Checks that an IFrame's contents can be modified without triggering CORS*/
const checkIFrameAccessible = (
  contentWindow?: HTMLIFrameElement['contentWindow']
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !!contentWindow?.document.head;
  } catch (error) {
    return false;
  }
};

export default function Legacy() {
  const history = useHistory();

  const legacyContent = useRef<HTMLIFrameElement>(null);
  const legacyWindow = legacyContent?.current?.contentWindow;

  // path state
  const initPath =
    legacyPart(history.location.pathname) + history.location.hash;
  const [initialLegacyPath, setInitialLegacyPath] = useState<string>(initPath);
  const [legacyPath, setLegacyPath] = useState<string>(initPath);
  const [badLegacyPath, setBadLegacyPath] = useState<boolean>(false);

  //height state
  const [legacyHeight, setLegacyHeight] = useState<string>('0');

  useEffect(() => {
    // This effect compares the inner and outer URLS (app URL and iframe URL)
    // to the current known URL in state. If the inner URL differs, the state
    // and outer URLs are updated to match the inner URL. If the outer URL
    // differs, the inner and state URLs are updated to match the outer URL.
    // If both inner & outer URLs differ from state, the inner URL takes
    // precedence.

    // This effect also manages the iframe height, as this needs to be updated
    // manually.

    const checkInterval = setInterval(() => {
      // sync urls
      const innerLocation = legacyContent.current?.contentWindow?.location;
      const outerLocation = window.location;
      let pathChanged = false;

      // check if iframe is inaccessible due to CORS
      if (!checkIFrameAccessible(legacyContent.current?.contentWindow)) {
        setBadLegacyPath(true);
        return;
      } else {
        setBadLegacyPath(false);
      }

      if (innerLocation) {
        // ensures the iframe has mounted
        const inner = innerLocation.pathname + (innerLocation.hash ?? '');
        const outer =
          legacyPart(outerLocation.pathname) + (outerLocation.hash ?? '');
        if (inner !== legacyPath) {
          setLegacyPath(inner);
          pathChanged = true;
          history.push(`/legacy${inner}`);
        } else if (outer !== legacyPath) {
          setLegacyPath(outer);
          setInitialLegacyPath(outer);
          legacyContent.current.src = outer;
          pathChanged = true;
        }
      }

      // set iframe height when the path changes or content exceeds the iframe
      // this may be slow if the inner content changes height frequently
      const iframeBody = legacyContent.current?.contentWindow?.document.body;
      const checkheight = iframeBody?.scrollHeight.toString();
      if (
        legacyContent.current &&
        checkheight &&
        (pathChanged || checkheight !== legacyHeight)
      ) {
        const scrollY = window.scrollY; // save current scroll position
        // reset iframe height to max container height, force reflow
        legacyContent.current.height = (
          window.innerHeight -
          (legacyContent.current.parentElement?.getBoundingClientRect().top ||
            0) -
          4
        ).toString();
        // use reflowed scroll height to set iframe height
        const setHeight = iframeBody?.scrollHeight.toString() || checkheight;
        legacyContent.current.height = setHeight;
        setLegacyHeight(setHeight);
        window.scrollTo(0, scrollY); // restore scroll position
      }
    }, 200);
    return () => {
      clearInterval(checkInterval);
    };
  }, [history, legacyContent, legacyPath, legacyHeight]);

  useEffect(() => {
    // This effect injects target=_top into all child iframe's `<head>` tags.
    // This is necessary to allow the iframe to navigate to third-party sites.
    if (legacyPath && legacyWindow) {
      const recurse = (contentWindow: Window) => {
        // check accessing the nested iframe doesnt trigger CORS
        if (!checkIFrameAccessible(contentWindow)) return;

        // inject target=_top into the iframe's document
        const base =
          contentWindow.document.head.querySelector('base') ||
          contentWindow.document.head.appendChild(
            contentWindow.document.createElement('base')
          );
        base.target = '_top';
        const iframes = contentWindow.document.body.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          if (iframe.contentWindow) recurse(iframe.contentWindow);
        });
      };
      recurse(legacyWindow);
    }
  }, [legacyPath, legacyWindow, badLegacyPath]);

  if (badLegacyPath) {
    return (
      <span>
        Something went wrong. Could not load external link within legacy page.
      </span>
    );
  } else {
    return (
      <iframe
        style={{ overflowY: 'hidden' }}
        frameBorder="0"
        src={initialLegacyPath}
        ref={legacyContent}
        title="Legacy Content"
        width="100%"
        height={legacyHeight}
      />
    );
  }
}
