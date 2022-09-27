import { useEffect, useMemo, useRef, useState } from 'react';
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

  useMessageListener((e) => {
    const d = e.data;
    if (isRouteMessage(d)) {
      navigate(`/legacy/${d.payload.request.original}`);
    } else if (isTitleMessage(d)) {
      setLegacyTitle(d.payload);
    }
  });

  // Only directly change the IFrame src if we've re-rendered the
  // iframe element itself. This prevents unwanted navigation events
  const initLegacyPath = useMemo(
    () => getLegacyPart(location.pathname + location.search + location.hash),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [legacyContentRef]
  );

  return (
    <iframe
      style={{ overflowY: 'hidden' }}
      frameBorder="0"
      src={formatLegacyUrl(initLegacyPath)}
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

type KbMessage<C extends string, M extends string, P> = {
  channel: C;
  message: M;
  payload: P;
};

const kbMessageGuard = <C extends string, M extends string, P>(
  channel: C,
  message: M,
  payloadGuard: (payload: unknown) => payload is P
) => {
  type Guarded = KbMessage<C, M, P>;
  return (recieved: unknown): recieved is Guarded =>
    typeof recieved === 'object' &&
    ['channel', 'message', 'payload'].every(
      (k) => k in (recieved as Record<string, never>)
    ) &&
    (recieved as Guarded).channel === channel &&
    (recieved as Guarded).message === message &&
    payloadGuard((recieved as Guarded).payload);
};

const isTitleMessage = kbMessageGuard(
  'ui',
  'setTitle',
  (payload): payload is string => typeof payload === 'string'
);

const isRouteMessage = kbMessageGuard(
  'app',
  'route-component',
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
//             channel: 'app',
//             message: 'route-component',
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
//             channel: 'ui',
//             message: 'setTitle',
//             payload: title,
//           });
//         }}
//       >
//         Send
//       </button>
//     </div>
//   );
// }
