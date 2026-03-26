import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicFeed } from '../services/experiencesService';
import { getUser, followUser } from '../services/usersService';

const Social = () => {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedData = await getPublicFeed(20);
        setFeed(feedData);
        
        // Get suggested users (simplified - would need a proper API in production)
        setSuggestedUsers([]);
      } catch (error) {
        console.error('Error fetching social data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      match: '⚽',
      sightseeing: '📸',
      food: '🍽️',
      accommodation: '🏨',
      transport: '🚗'
    };
    return icons[type] || '📌';
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Social</h1>

      {/* Tabs */}
      <div className="flex gap-sm mb-lg" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'feed', label: '📰 Feed' },
          { id: 'discover', label: '🔍 Descubrir' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : 'none' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'feed' ? (
        <div className="feed">
          {feed.length > 0 ? (
            feed.map(item => (
              <div key={item.id} className="card feed-item">
                <div className="card-body">
                  <div className="flex items-center gap-sm mb-md">
                    <div className="avatar" style={{ width: '40px', height: '40px' }}>
                      {item.userId?.[0] || '?'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>
                        {item.displayName || item.username || 'Usuario'}
                      </p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{ marginLeft: 'auto' }}>
                      {getTypeIcon(item.type)}
                    </span>
                  </div>

                  <Link to={`/experiences/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{item.title}</h3>
                  </Link>

                  {item.description && (
                    <p className="text-muted" style={{ marginBottom: '12px' }}>
                      {item.description.length > 150 
                        ? `${item.description.substring(0, 150)}...` 
                        : item.description}
                    </p>
                  )}

                  {item.location && (
                    <p className="text-primary" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                      📍 {item.location.city || item.location.address}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '8px' }}>
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-lg" style={{ 
                    paddingTop: '12px', 
                    borderTop: '1px solid var(--border)',
                    marginTop: '12px'
                  }}>
                    <span className="flex items-center gap-sm text-muted">
                      ❤️ {item.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-sm text-muted">
                      💬 {item.comments?.length || 0}
                    </span>
                    <Link 
                      to={`/experiences/${item.id}`}
                      className="flex items-center gap-sm text-primary"
                      style={{ marginLeft: 'auto' }}
                    >
                      Ver más →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📰</div>
              <h3>No hay actividad todavía</h3>
              <p className="text-muted">¡Sé el primero en compartir una experiencia!</p>
              <Link to="/experiences/create" className="btn btn-primary mt-md">
                Crear Experiencia
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Discover Users */}
          <div className="card mb-lg">
            <div className="card-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Usuarios sugeridos</h2>
            </div>
            <div className="card-body">
              {suggestedUsers.length > 0 ? (
                <div className="flex gap-md" style={{ overflowX: 'auto' }}>
                  {suggestedUsers.map(suggestedUser => (
                    <div key={suggestedUser.id} style={{ textAlign: 'center', minWidth: '100px' }}>
                      <div className="avatar" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
                        {suggestedUser.displayName?.[0] || '?'}
                      </div>
                      <p style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '0.875rem' }}>
                        {suggestedUser.displayName}
                      </p>
                      <button 
                        className="btn btn-secondary btn-block"
                        style={{ marginTop: '8px', fontSize: '0.75rem' }}
                        onClick={() => followUser(user.uid, suggestedUser.id)}
                      >
                        Seguir
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No hay sugerencias por ahora</p>
              )}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>📈 Trending</h2>
            </div>
            <div className="card-body">
              {['#ElClasico', '#UCL', '#PremierLeague', '#LaLiga', '#SerieA'].map((tag, index) => (
                <div key={index} className="flex justify-between items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 'bold' }}>{tag}</span>
                  <span className="text-muted">{Math.floor(Math.random() * 500 + 100)} posts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;
