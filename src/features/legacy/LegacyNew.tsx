import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../common/hooks';

export default function Legacy() {
  // TODO: iframe height
  // TODO: external navigation and <base target="_top"> equivalent
  // TODO: check for kbase-ui reloads where not needed
  const location = useLocation();
  const navigate = useNavigate();

  const legacyContentRef = useRef<HTMLIFrameElement>(null);
  const [legacyTitle, setLegacyTitle] = useState('');
  usePageTitle(legacyTitle);

  const expectedLegacyPath = getLegacyPart(
    location.pathname + location.search + location.hash
  );
  const [legacyPath, setLegacyPath] = useState(expectedLegacyPath);

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
  }, [expectedLegacyPath, legacyPath, legacyContentRef]);

  useMessageListener((e) => {
    const d = e.data;
    if (isRouteMessage(d)) {
      navigate(`./${d.payload.request.original}`);
      setLegacyPath(d.payload.request.original);
    } else if (isTitleMessage(d)) {
      setLegacyTitle(d.payload);
    }
  });

  const legacySrcValue = useMemo(
    () => formatLegacyUrl(legacyPath),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [legacyContentRef]
  );

  return (
    <iframe
      style={{ overflowY: 'hidden' }}
      frameBorder="0"
      src={legacySrcValue}
      ref={legacyContentRef}
      title="Legacy Content Wrapper"
      width="100%"
      height="100%"
    />
  );
}

const getLegacyPart = (path: string) =>
  path.match(/(?:\/legacy)+(?:\/(.*))$/)?.[1] || '/';

const formatLegacyUrl = (path: string) =>
  `https://legacy.ci-europa.kbase.us/#${path}`; //`/dev/legacy-spoof/${path}`;

// const formatLegacyUrl = (path: string) => `/dev/legacy-spoof/${path}`;

const useMessageListener = function <T = unknown>(
  handler: (this: Window, ev: MessageEvent<T>) => void
) {
  useEffect(() => {
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, [handler]);
};

type KbMessage<S extends string, P> = {
  source: S;
  payload: P;
};

const kbMessageGuard = <S extends string, P>(
  source: S,
  payloadGuard: (payload: unknown) => payload is P
) => {
  type Guarded = KbMessage<S, P>;
  return (recieved: unknown): recieved is Guarded =>
    typeof recieved === 'object' &&
    ['source', 'payload'].every(
      (k) => k in (recieved as Record<string, never>)
    ) &&
    (recieved as Guarded).source === source &&
    payloadGuard((recieved as Guarded).payload);
};

const isTitleMessage = kbMessageGuard(
  'kbase-ui.ui.setTitle',
  (payload): payload is string => typeof payload === 'string'
);

const isRouteMessage = kbMessageGuard(
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
