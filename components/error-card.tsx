import { Button } from './ui/button';

const ErrorCard = ({ handleRetry }: { handleRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-700">
          Unable to fetch
        </h3>
        <p className="mb-4 text-sm text-red-600">
          Something went wrong while fetching. Please try again.
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
