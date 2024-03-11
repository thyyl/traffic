import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import { Button } from "./button";

interface ErrorComponentProps extends React.PropsWithChildren {
  error: boolean;
}

export const ErrorComponent: React.FC<
  React.PropsWithChildren<ErrorComponentProps>
> = ({ error, children }) => {
  return (
    <div>
      {error ? (
        <div>
          <Image
            src="/images/failure.png"
            height={144}
            width={144}
            alt="empty"
          />
          <p>An error occurred. Please try again later.</p>
          <Button
            className="my-4"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      ) : (
        <ErrorBoundary
          FallbackComponent={({ resetErrorBoundary }) => (
            <div className="gap-y-4">
              <Image
                src="/images/failure.png"
                height={144}
                width={144}
                alt="empty"
              />
              <p>An error occurred. Please try again later.</p>
              <Button className="my-4" onClick={resetErrorBoundary}>
                Reset
              </Button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </div>
  );
};
