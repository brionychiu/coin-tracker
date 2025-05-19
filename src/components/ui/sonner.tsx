'use client';

import {
  AlertTriangle,
  BadgeInfo,
  CircleCheckBig,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      icons={{
        success: <CircleCheckBig className="size-5 text-primary-02" />,
        info: <BadgeInfo className="size-5 text-green-01" />,
        warning: <AlertTriangle className="size-5 text-warning-01" />,
        error: <XCircle className="size-5 text-error-01" />,
        loading: <Loader2 className="size-5 animate-spin text-primary-02" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
