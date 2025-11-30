import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
            📊 Comparador Tributário
          </Link>
          
          <div className="flex gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Início
            </Link>
            {/* Adicione mais links de navegação aqui */}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
