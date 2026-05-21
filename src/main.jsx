import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    hydrateRoot(
        rootElement,
        <StrictMode>
            <ErrorBoundary appName="Kone-Lab">
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ErrorBoundary>
        </StrictMode>
    );
} else {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <ErrorBoundary appName="Kone-Lab">
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ErrorBoundary>
        </StrictMode>
    );
}
