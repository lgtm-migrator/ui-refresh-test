import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../common/hooks';

export default function Legacy() {
  // TODO: iframe height
  // TODO: external navigation and <base target="_top"> equivalent
  const location = useLocation();
  const navigate = useNavigate();

  const legacyContentRef = useRef<HTMLIFrameElement>(null);
  const [legacyTitle, setLegacyTitle] = useState('');
  usePageTitle(legacyTitle);

  // The path that should be in the iframe based on the current parent window location
  const expectedLegacyPath = getLegacyPart(
    location.pathname + location.search + location.hash
  );
  // The actual current path, set by navigation events from kbase-ui
  const [legacyPath, setLegacyPath] = useState(expectedLegacyPath);

  // Listen for messages from the iframe
  useMessageListener(legacyContentRef.current?.contentWindow, (e) => {
    const d = e.data;
    if (isRouteMessage(d)) {
      // Navigate the parent window when the iframe sends a navigation event
      let path = d.payload.request.original;
      if (path[0] === '/') path = path.slice(1);
      setLegacyPath(d.payload.request.original);
      navigate(`./${d.payload.request.original}`);
    } else if (isTitleMessage(d)) {
      setLegacyTitle(d.payload);
    }
  });

  // The following enables navigation events from Europa to propagate to the
  // iframe. When expectedLegacyPath (from the main window URL) changes, check
  // that legacyPath (from the iframe) martches, otherwise, send the iframe a
  // postMessage with navigation instructions. legacyPath will be updated
  // downstream (the ui navigation event will send a message back to europa with
  // the new route). We only want to watch for changes on expectedLegacyPath
  // here, as watching legacyPath will cause this to run any time the iframe's
  // location changes.
  useEffect(() => {
    if (
      expectedLegacyPath !== legacyPath &&
      legacyContentRef.current?.contentWindow
    ) {
      legacyContentRef.current.contentWindow.postMessage(
        {
          source: 'europa.navigate',
          payload: { path: expectedLegacyPath },
        },
        '*'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expectedLegacyPath, legacyContentRef]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexFlow: 'column nowrap',
      }}
    >
      <iframe
        frameBorder="0"
        // We want the src to always match the content of the iframe, so as not to
        // cause the iframe to reload inappropriately
        src={formatLegacyUrl(legacyPath)}
        ref={legacyContentRef}
        title="Legacy Content Wrapper"
        width="100%"
        height="100%"
      />
    </div>
  );
}

const getLegacyPart = (path: string) =>
  path.match(/(?:\/legacy)+(?:\/+(.*))$/)?.[1] || '/';

const formatLegacyUrl = (path: string) =>
  `https://legacy.ci-europa.kbase.us/#${path}`; //`/dev/legacy-spoof/${path}`;

// const formatLegacyUrl = (path: string) => `/dev/legacy-spoof/${path}`;

const useMessageListener = function <T = unknown>(
  target: Window | null | undefined,
  handler: (ev: MessageEvent<T>) => void
) {
  useEffect(() => {
    const wrappedHandler = (ev: MessageEvent<T>) => {
      // eslint-disable-next-line no-console
      console.log('MESSAGE', ev);
      if (ev.source !== target) return;
      handler(ev);
    };
    window.addEventListener('message', wrappedHandler);
    return () => {
      window.removeEventListener('message', wrappedHandler);
    };
  }, [handler, target]);
};

type Message<S extends string, P> = {
  source: S;
  payload: P;
};

const messageGuard = <S extends string, P>(
  source: S,
  payloadGuard: (payload: unknown) => payload is P
) => {
  type Guarded = Message<S, P>;
  return (recieved: unknown): recieved is Guarded =>
    typeof recieved === 'object' &&
    ['source', 'payload'].every(
      (k) => k in (recieved as Record<string, never>)
    ) &&
    (recieved as Guarded).source === source &&
    payloadGuard((recieved as Guarded).payload);
};

const isTitleMessage = messageGuard(
  'kbase-ui.ui.setTitle',
  (payload): payload is string => typeof payload === 'string'
);

const isRouteMessage = messageGuard(
  'kbase-ui.app.route-component',
  (payload): payload is { request: { original: string } } =>
    !!payload &&
    typeof payload === 'object' &&
    'request' in (payload as Record<string, never>) &&
    typeof (payload as Record<string, unknown>).request === 'object' &&
    'original' in (payload as Record<string, Record<string, never>>).request &&
    typeof (payload as Record<string, Record<string, string>>).request
      .original === 'string'
);

// export function LegacySpoof() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const loc = location.pathname + location.search + location.hash;

//   const [path, setPath] = useState(
//     loc.match(/(?:\/legacy-spoof)+(?:\/(.*))$/)?.[1] || ''
//   );
//   const [title, setTitle] = useState('NoTitle');
//   useEffect(() => {
//     setPath(loc.match(/(?:\/legacy-spoof)+(?:\/(.*))$/)?.[1] || '');
//   }, [loc]);
//   return (
//     <div>
//       <input
//         type="text"
//         value={path}
//         onChange={(e) => setPath(e.currentTarget.value)}
//       />
//       <button
//         onClick={() => {
//           window.parent.postMessage({
//             source: 'kbase-ui.app.route-component',
//             payload: {
//               route: {},
//               request: {
//                 realPath: [],
//                 path: [],
//                 original: path,
//                 query: {},
//               },
//               params: {},
//             },
//           });
//           navigate(`/legacy-spoof/${path}`);
//         }}
//       >
//         Send
//       </button>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.currentTarget.value)}
//       />
//       <button
//         onClick={() => {
//           window.parent.postMessage({
//             source: 'kbase-ui.ui.setTitle',
//             payload: title,
//           });
//         }}
//       >
//         Send
//       </button>
//     </div>
//   );
// }
