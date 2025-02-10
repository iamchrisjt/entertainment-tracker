import { ReactNode } from "react";

import { ThemeProvider } from './ui/theme-provider'
import { ModeToggle } from "./ui/mode-toggle";
import { Toaster } from "./ui/toaster";


const DefaultWrapper = ({ children } : { children : ReactNode}) => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <ModeToggle/>
            {children}
            <Toaster />
        </ThemeProvider>
    );

}

export default DefaultWrapper;