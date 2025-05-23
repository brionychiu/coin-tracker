import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
      <Loader2 className="mb-2 h-5 w-5 animate-spin" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}
