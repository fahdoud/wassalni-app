
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useIsMobileSimple } from "@/hooks/use-mobile";

interface ToasterProps {
  [key: string]: any;
}

export function Toaster({ ...props }: ToasterProps) {
  const isMobile = useIsMobileSimple();
  
  const mobileProps = isMobile 
    ? { position: "top-center" as const } 
    : {};
    
  const { toasts } = useToast()

  return (
    <ToastProvider {...mobileProps} {...props}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
