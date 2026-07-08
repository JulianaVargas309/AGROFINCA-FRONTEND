import { Component, type ReactNode, type ErrorInfo } from "react"
import { ErrorPage } from "./ErrorPage"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: "" }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary capturó:", error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: "" })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <ErrorPage
          title="Error en la aplicación"
          message={this.state.message}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
