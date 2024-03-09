import React, { Fragment } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";

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
        </div>
      ) : (
        <ErrorBoundary
          FallbackComponent={() => (
            <div>
              <Image
                src="/images/failure.png"
                height={144}
                width={144}
                alt="empty"
              />
              <p>An error occurred. Please try again later.</p>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </div>
  );
};
