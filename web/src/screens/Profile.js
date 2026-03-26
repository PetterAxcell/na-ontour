import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUser } from '../services/usersService';
import { getTripsByUser } from '../services/tripsService';
import { getExperiences } from '../services/experiencesService';
import { followUser, unfollowUser } from '../services/usersService';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, userData } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState('trips');
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !id || id === currentUser?.uid;
  const profileId = id || currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (profileId) {
        try {
          const [userData, tripsData, experiencesData] = await Promise.all([
            getUser(profileId),
            getTripsByUser(profileId),
            getExperiences({ userId: profileId })
          ]);
          setProfileUser(userData);
          setTrips(tripsData);
          setExperiences(experiencesData);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [profileId]);

  const handleFollow = async () => {
    if (!currentUser || !profileUser) return;
    
    const isFollowing = currentUser?.userData?.following?.includes(profileId);
    
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.uid, profileId);
      } else {
        await followUser(currentUser.uid, profileId);
      }
      // Refresh user data
      const updatedUser = await getUser(profileId);
      setProfileUser(updatedUser);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!profileUser) {
    return (
      <div className="empty-state">
        <h3>Usuario no encontrado</h3>
      </div>
    );
  }

  const isFollowing = userData?.following?.includes(profileId);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="card mb-lg">
        <div className="card-body">
          <div className="flex gap-lg" style={{ alignItems: 'flex-start' }}>
            <div className="avatar avatar-xl">
              {profileUser.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            
            <div style={{ flex: 1 }}>
              <div className="flex justify-between items-center">
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                    {profileUser.displayName}
                  </h1>
                  <p className="text-muted">@{profileUser.username}</p>
                </div>
                
                {isOwnProfile ? (
                  <button className="btn btn-secondary">Editar perfil</button>
                ) : (
                  <button 
                    className={`btn ${isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                )}
              </div>

              {profileUser.bio && (
                <p style={{ margin: '16px 0' }}>{profileUser.bio}</p>
              )}

              <div className="flex gap-lg text-muted" style={{ fontSize: '0.875rem' }}>
                {profileUser.homeCity && (
                  <span>📍 {profileUser.homeCity}, {profileUser.homeCountry}</span>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-xl mt-md" style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{trips.length}</span>
                  <span className="text-muted" style={{ marginLeft: '4px' }}>Viajes</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{experiences.length}</span>
                  <span className="text-muted" style={{ marginLeft: '4px' }}>Experiencias</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{profileUser.followers?.length || 0}</span>
                  <span className="text-muted" style={{ marginLeft: '4px' }}>Seguidores</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{profileUser.following?.length || 0}</span>
                  <span className="text-muted" style={{ marginLeft: '4px' }}>Siguiendo</span>
                </div>
              </div>
            </div>

            {/* Faniq Score */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Faniq Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {profileUser.faniqScore || 0}
              </p>
              <p style={{ opacity: 0.8, fontSize: '0.75rem' }}>puntos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {profileUser.badges && profileUser.badges.length > 0 && (
        <div className="card mb-lg">
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>🏅 Insignias</h2>
          </div>
          <div className="card-body flex gap-md" style={{ flexWrap: 'wrap' }}>
            {profileUser.badges.map((badge, index) => (
              <div key={index} style={{
                padding: '8px 16px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-sm mb-lg" style={{ borderBottom: '1px solid var(--border)' }}>
        {['trips', 'experiences'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(tab)}
            style={{ borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none' }}
          >
            {tab === 'trips' ? `✈️ Viajes (${trips.length})` : `📸 Experiencias (${experiences.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'trips' ? (
        trips.length > 0 ? (
          <div className="grid-2">
            {trips.map(trip => (
              <div key={trip.id} className="card">
                <div className="card-body">
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{trip.title}</h3>
                  <p className="text-muted">
                    📍 {trip.destinationCity}, {trip.destinationCountry}
                  </p>
                  <p className="text-primary" style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                    {new Date(trip.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-muted">No hay viajes</p>
          </div>
        )
      ) : (
        experiences.length > 0 ? (
          <div className="grid-3">
            {experiences.map(exp => (
              <div key={exp.id} className="card">
                <div style={{ 
                  height: '120px', 
                  background: '#F5F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  📸
                </div>
                <div className="card-body">
                  <h4 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{exp.title}</h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    ❤️ {exp.likes?.length || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-muted">No hay experiencias</p>
          </div>
        )
      )}
    </div>
  );
};

export default Profile;
