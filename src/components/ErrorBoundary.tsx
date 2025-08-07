import { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4 text-parchment min-h-screen flex flex-col items-center">
          <h1 className="text-4xl font-cinzel text-medieval-gold mb-6">Algo deu errado!</h1>
          <p className="text-lg text-medieval-gold mb-4">
            Ocorreu um erro: {this.state.error?.message || 'Desconhecido'}
          </p>
          <p className="text-medieval-gold mb-4">
            Tente voltar à página inicial ou criar um novo herói.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-6 py-3 bg-medieval-gold text-medieval-dark rounded-lg hover:bg-yellow-600 font-cinzel"
            >
              Voltar ao Início
            </Link>
            <Link
              to="/create-hero"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-cinzel"
            >
              Criar Herói
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;