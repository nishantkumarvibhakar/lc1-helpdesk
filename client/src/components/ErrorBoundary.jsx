import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-xs text-slate-500">
              {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-left font-mono text-[11px] text-slate-600 overflow-x-auto border border-slate-200 max-h-40">
            {this.state.error?.stack || String(this.state.error)}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-du-navy text-du-gold font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Page</span>
            </button>

            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
