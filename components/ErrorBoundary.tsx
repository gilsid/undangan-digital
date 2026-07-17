"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Error boundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f8f4ef" }}>
          <div className="text-center px-6">
            <p
              className="text-2xl font-light text-[#2c2c2c] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Maaf, terjadi kesalahan
            </p>
            <p className="text-[#6b6560] text-sm">
              Silakan refresh halaman atau coba lagi nanti.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
