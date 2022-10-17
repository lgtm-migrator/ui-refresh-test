import { usePageTitle } from './layoutSlice';

export default function ErrorPage({
  error,
  resetErrorBoundary,
}: {
  error: {};
  resetErrorBoundary: () => void;
}) {
  usePageTitle('Something went wrong');
  return (
    <div role="alert">
      <pre>
        {error instanceof Error ? error.toString() : JSON.stringify(error)}
      </pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
