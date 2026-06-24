'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface ChartData {
  name: string;
  count: number;
}
export default function StatsCharts() {
  const [eventsByMonth, setEventsByMonth] = useState<ChartData[]>([]);
  const [roomsData, setRoomsData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      const eventsRes = await fetch('/api/events');
      const events = await eventsRes.json();
      const roomsRes = await fetch('/api/rooms');
      const rooms = await roomsRes.json();
      const months: { [key: string]: number } = {};
      events.forEach((event: any) => {
        if (event.startDate) {
          const date = new Date(event.startDate);
          const month = date.toLocaleString('fr-FR', { month: 'short' });
          months[month] = (months[month] || 0) + 1;
        }
      });
      const eventsByMonthData = Object.entries(months).map(([name, count]) => ({ name, count }));
      setEventsByMonth(eventsByMonthData);
      const disponibleCount = rooms.filter((r: any) => r.disponible !== false).length;
      const indisponibleCount = rooms.length - disponibleCount;
      setRoomsData([
        { name: 'Disponibles', count: disponibleCount },
        { name: 'Indisponibles', count: indisponibleCount },
      ]);
    } catch (error) {
      console.error('Erreur chargement graphiques:', error);
    } finally {
      setLoading(false);
    }
  };
  const COLORS = ['#10b981', '#ef4444', '#d4af37', '#1e293b', '#3b82f6'];
  const totalRooms = roomsData.reduce((sum, item) => sum + item.count, 0);
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement des graphiques...</div>;
  }
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '24px',
      marginBottom: '30px'
    }}>
      {}
      {eventsByMonth.length > 0 && (
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📅 Événements par mois</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#d4af37" name="Nombre d'événements" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {}
      {roomsData.length > 0 && (
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>🏢 Disponibilité des salles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomsData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => {
                  const percentage = percent ? (percent * 100).toFixed(0) : '0';
                  return `${name}: ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {roomsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} salle(s)`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {}
      {eventsByMonth.length > 0 && (
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>📈 Tendance des événements</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#d4af37" strokeWidth={2} name="Événements" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
