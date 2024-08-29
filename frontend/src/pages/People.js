import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './People.css';

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/people`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPeople(response.data.people);
      } catch (err) {
        setError('Failed to fetch people');
        console.error('Error fetching people:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="people-container">
      <h2>People</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="people-list">
        {people.map(person => (
          <div key={person.id} className="person-card">
            <h3>{person.username}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
