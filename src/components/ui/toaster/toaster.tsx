import { ToasterProvider } from './toaster-context';
import { ToasterContainer } from './toaster-container';

export { useToaster } from './toaster-context';

export function Toaster({ children }: { children?: React.ReactNode }) {
    return (
        <ToasterProvider>
            {children}
            <ToasterContainer />
        </ToasterProvider>
    );
}