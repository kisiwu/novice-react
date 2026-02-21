import { useRouteError } from 'react-router';

export interface RouteErrorObject {
  statusText?: string, message?: string
}

function isRouteErrorObject(v: unknown): v is RouteErrorObject {
  return !!(v &&
    typeof v == 'object' &&
    (
      ('statusText' in v && typeof v.statusText == 'string') ||
      ('message' in v && typeof v.message == 'string')
    ))
}


export default function ErrorPage() {
  const error  = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{isRouteErrorObject(error) ? (error?.statusText || error?.message) : ''}</i>
      </p>
    </div>
  );
}