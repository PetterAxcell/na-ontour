import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, usePosts, useUsers, useClubs } from '../hooks/useFirebase'

export default function HomeScreen() {
  const { user } = useAuth()
  const { posts, loading: postsLoading } = usePosts()
  const { users, loading: usersLoading } = useUsers()
  const { clubs, loading: clubsLoading } = useClubs()

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">⚽ NA-ONTOUR</h1>
          <div className="flex gap-4">
            <Link to="/viajes" className="text-gray-300 hover:text-white">✈️ Viajes</Link>
            <Link to="/experiencias" className="text-gray-300 hover:text-white">📸 Experiencias</Link>
            <Link to="/clubes" className="text-gray-300 hover:text-white">🏟️ Clubes</Link>
            <Link to="/perfil" className="text-gray-300 hover:text-white">👤 Perfil</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{users.length}</div>
            <div className="text-sm text-gray-400">Usuarios</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{clubs.length}</div>
            <div className="text-sm text-gray-400">Clubes</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{posts.length}</div>
            <div className="text-sm text-gray-400">Publicaciones</div>
          </div>
        </div>

        {/* Feed de Posts */}
        <h2 className="text-xl font-bold mb-4">📰 Feed Global</h2>
        
        {posts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            <p className="mb-4">No hay publicaciones todavía.</p>
            <p className="text-sm">¡Sé el primero en publicar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => {
              const postUser = users.find(u => u.id === post.userId || u.uid === post.userId)
              return (
                <div key={post.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg mr-3">
                      {postUser?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium">{postUser?.name || 'Usuario'}</p>
                      <p className="text-xs text-gray-400">
                        {post.createdAt?.toLocaleDateString?.() || 'Ahora'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="mb-3">{post.content}</p>
                  
                  {post.photos?.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {post.photos.map((photo, idx) => (
                        <img 
                          key={idx}
                          src={photo} 
                          alt="" 
                          className="rounded-lg w-full h-40 object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-sm text-gray-400">
                    <button className="hover:text-blue-400">
                      👍 {post.likes?.length || 0} Me gusta
                    </button>
                    <button className="hover:text-blue-400">
                      💬 {post.comments?.length || 0} Comentarios
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
