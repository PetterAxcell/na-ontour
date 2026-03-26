import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useClubs } from '../hooks/useFirebase'

export default function ClubsScreen() {
  const { user } = useAuth()
  const { clubs, loading } = useClubs()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClubs = clubs.filter(club =>
    club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="text-center">Cargando clubes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🏟️ Clubes</h1>
          <Link to="/perfil" className="text-blue-400 hover:text-blue-300">
            ← Volver
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar clubes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* All Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClubs.map(club => (
            <div key={club.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition">
              <div className="flex items-center mb-3">
                <div className="text-4xl mr-3">{club.logo || '⚽'}</div>
                <div>
                  <h3 className="text-xl font-bold">{club.name}</h3>
                  <p className="text-gray-400 text-sm">{club.founded ? `Fundado: ${club.founded}` : ''}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{club.description || 'Sin descripción'}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {club.fans?.length || 0} fans
                </span>
                <button 
                  onClick={() => {/* TODO: Follow club */}}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {user?.clubs?.includes(club.id) ? '✓ Siguiendo' : 'Seguir'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No se encontraron clubes
          </div>
        )}
      </div>
    </div>
  )
}
