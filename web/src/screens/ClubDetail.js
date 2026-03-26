import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClub } from '../services/clubsService';
import { getExperiencesByClub } from '../services/experiencesService';

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubData, experiencesData] = await Promise.all([
          getClub(id),
          getExperiencesByClub(id)
        ]);
        setClub(clubData);
        setExperiences(experiencesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!club) {
    return (
      <div className="empty-state">
        <h3>Club no encontrado</h3>
        <Link to="/clubs" className="btn btn-primary mt-md">Ver todos los clubes</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button className="btn btn-ghost mb-lg" onClick={() => navigate('/clubs')}>
        ← Volver a Clubes
      </button>

      {/* Header */}
      <div className="card mb-lg">
        <div style={{
          height: '200px',
          background: club.coverImageUrl 
            ? `url(${club.coverImageUrl})`
            : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {club.logoUrl ? (
              <img 
                src={club.logoUrl} 
                alt={club.name}
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              />
            ) : '⚽'}
          </div>
        </div>
        
        <div className="card-body" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>
            {club.name}
          </h1>
          <p className="text-muted" style={{ fontSize: '1.25rem' }}>
            {club.shortName}
          </p>
          
          <div className="flex justify-center gap-lg mt-md text-muted">
            <span>📍 {club.city}, {club.country}</span>
            {club.league && <span>🏆 {club.league}</span>}
            {club.foundedYear && <span>📅 Fundado {club.foundedYear}</span>}
          </div>

          <div className="flex justify-center gap-md mt-md">
            <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '8px 16px' }}>
              👥 {club.fansCount || 0} fans
            </span>
          </div>
        </div>
      </div>

      {/* Stadium Info */}
      {club.stadium && (
        <div className="card mb-lg">
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>🏟️ Estadio</h2>
          </div>
          <div className="card-body">
            <h3 style={{ fontWeight: 'bold' }}>{club.stadium.name}</h3>
            {club.stadium.address && (
              <p className="text-muted">📍 {club.stadium.address}</p>
            )}
            {club.stadium.capacity && (
              <p className="text-muted">👥 Capacidad: {club.stadium.capacity.toLocaleString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {club.description && (
        <div className="card mb-lg">
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Sobre el club</h2>
          </div>
          <div className="card-body">
            <p style={{ lineHeight: '1.8' }}>{club.description}</p>
          </div>
        </div>
      )}

      {/* Colors */}
      {club.colors && club.colors.length > 0 && (
        <div className="card mb-lg">
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Colores</h2>
          </div>
          <div className="card-body flex gap-md">
            {club.colors.map((color, index) => (
              <div 
                key={index}
                style={{
                  width: '60px',
                  height: '60px',
                  background: color,
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Experiences */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            Experiencias ({experiences.length})
          </h2>
        </div>
        <div className="card-body">
          {experiences.length > 0 ? (
            <div className="grid-2">
              {experiences.slice(0, 6).map(exp => (
                <Link key={exp.id} to={`/experiences/${exp.id}`} className="card" style={{ textDecoration: 'none' }}>
                  <div className="card-body">
                    <h4 style={{ fontWeight: 'bold' }}>{exp.title}</h4>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {exp.description?.substring(0, 80)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center">No hay experiencias para este club todavía</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
