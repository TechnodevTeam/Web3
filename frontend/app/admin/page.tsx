'use client';

import { Admin, Resource, List, Datagrid, TextField, EmailField, DateField, Edit, SimpleForm, TextInput, Create, NumberInput, BooleanField, BooleanInput, DateInput } from 'react-admin';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import StatsCharts from './components/StatsCharts';
import './admin.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#d4af37' },
    secondary: { main: '#1e293b' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: { backgroundColor: '#1e293b' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#d4af37',
            color: '#1e293b',
            '&:hover': { backgroundColor: '#b8942e' },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
        },
      },
    },
  },
});

// ============================================
// DONNÉES UTILISATEURS (localStorage)
// ============================================
const getUsers = () => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// ============================================
// COMPOSANT STATISTIQUES AVEC BOUTONS DE NAVIGATION
// ============================================
function DashboardStats({ refreshTrigger }: { refreshTrigger: number }) {
  const [stats, setStats] = useState({ users: 0, rooms: 0, events: 0 });

  const loadStats = () => {
    const users = getUsers();
    
    fetch('/api/rooms')
      .then(res => res.json())
      .then(rooms => {
        fetch('/api/events')
          .then(res => res.json())
          .then(events => {
            setStats({ 
              users: users.length, 
              rooms: rooms.length, 
              events: events.length 
            });
          })
          .catch(() => {
            setStats({ users: users.length, rooms: rooms.length, events: 0 });
          });
      })
      .catch(() => {
        setStats({ users: users.length, rooms: 0, events: 0 });
      });
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  return (
    <div>
      {/* Cartes statistiques */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px', 
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '180px', background: '#1e293b', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d4af37' }}>{stats.users}</div>
          <div style={{ color: '#94a3b8', marginTop: '8px', fontSize: '0.9rem' }}>👥 Utilisateurs</div>
        </div>
        <div style={{ flex: 1, minWidth: '180px', background: '#1e293b', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d4af37' }}>{stats.rooms}</div>
          <div style={{ color: '#94a3b8', marginTop: '8px', fontSize: '0.9rem' }}>🏢 Salles</div>
        </div>
        <div style={{ flex: 1, minWidth: '180px', background: '#1e293b', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d4af37' }}>{stats.events}</div>
          <div style={{ color: '#94a3b8', marginTop: '8px', fontSize: '0.9rem' }}>📅 Événements</div>
        </div>
      </div>

      {/* BOUTONS DE NAVIGATION VERS LES RESSOURCES */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '30px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <a
          href="/admin#/users"
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'inline-block',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          👥 Gérer les utilisateurs
        </a>
        
        <a
          href="/admin#/rooms"
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'inline-block',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          🏢 Gérer les salles
        </a>
        
        <a
          href="/admin#/events"
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #d4af37 0%, #b8942e 100%)',
            color: '#0f172a',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'inline-block',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          📅 Gérer les événements
        </a>
      </div>
    </div>
  );
}

// ============================================
// DATA PROVIDER
// ============================================
const dataProvider = {
  getList: async (resource: string, params: any) => {
    if (resource === 'users') {
      const users = getUsers();
      return { data: users, total: users.length };
    }
    if (resource === 'rooms') {
      const response = await fetch('/api/rooms');
      const rooms = await response.json();
      return { data: rooms, total: rooms.length };
    }
    if (resource === 'events') {
      const response = await fetch('/api/events');
      const events = await response.json();
      return { data: events, total: events.length };
    }
    return { data: [], total: 0 };
  },

  getOne: async (resource: string, params: any) => {
    if (resource === 'users') {
      const users = getUsers();
      return { data: users.find((u: any) => u.id === params.id) };
    }
    if (resource === 'rooms') {
      const response = await fetch(`/api/rooms/${params.id}`);
      const room = await response.json();
      return { data: room };
    }
    if (resource === 'events') {
      const response = await fetch(`/api/events/${params.id}`);
      const event = await response.json();
      return { data: event };
    }
    return { data: null };
  },

  getMany: async (resource: string, params: any) => {
    if (resource === 'users') {
      const users = getUsers();
      return { data: users.filter((u: any) => params.ids.includes(u.id)) };
    }
    if (resource === 'rooms') {
      const response = await fetch('/api/rooms');
      const rooms = await response.json();
      return { data: rooms.filter((r: any) => params.ids.includes(r.id)) };
    }
    if (resource === 'events') {
      const response = await fetch('/api/events');
      const events = await response.json();
      return { data: events.filter((e: any) => params.ids.includes(e.id)) };
    }
    return { data: [] };
  },

  create: async (resource: string, params: any) => {
    if (resource === 'users') {
      const users = getUsers();
      const newUser = { ...params.data, id: Date.now().toString(), createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: newUser };
    }
    if (resource === 'rooms') {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params.data)
      });
      const newRoom = await response.json();
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: newRoom };
    }
    if (resource === 'events') {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params.data)
      });
      const newEvent = await response.json();
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: newEvent };
    }
    return { data: null };
  },

  update: async (resource: string, params: any) => {
    if (resource === 'users') {
      const users = getUsers();
      const index = users.findIndex((u: any) => u.id === params.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...params.data };
        localStorage.setItem('users', JSON.stringify(users));
      }
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: users[index] };
    }
    if (resource === 'rooms') {
      const response = await fetch(`/api/rooms/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params.data)
      });
      const updatedRoom = await response.json();
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: updatedRoom };
    }
    if (resource === 'events') {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params.data)
      });
      const updatedEvent = await response.json();
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: updatedEvent };
    }
    return { data: params.data };
  },

  delete: async (resource: string, params: any) => {
    if (resource === 'users') {
      const users = getUsers();
      const filteredUsers = users.filter((u: any) => u.id !== params.id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: { id: params.id } };
    }
    if (resource === 'rooms') {
      await fetch(`/api/rooms/${params.id}`, { method: 'DELETE' });
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: { id: params.id } };
    }
    if (resource === 'events') {
      await fetch(`/api/events/${params.id}`, { method: 'DELETE' });
      if (typeof window !== 'undefined') (window as any).refreshDashboardStats?.();
      return { data: { id: params.id } };
    }
    return { data: { id: params.id } };
  },

  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async (resource: string, params: any) => ({ data: params.ids }),
  deleteMany: async (resource: string, params: any) => ({ data: params.ids }),
};

// ============================================
// AUTH PROVIDER
// ============================================
const authProvider = {
  login: async () => {},
  logout: async () => {
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  },
  checkAuth: async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/admin/login';
      throw new Error('Non authentifié');
    }
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      window.location.href = '/admin/login';
      throw new Error('Non autorisé');
    }
  },
  checkError: async () => {},
  getPermissions: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || 'user';
  },
  getIdentity: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { id: user.id, fullName: user.name || user.email };
  },
};

// ============================================
// COMPOSANTS UTILISATEURS
// ============================================
const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="firstName" label="Prénom" />
      <TextField source="lastName" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="role" label="Rôle" />
      <DateField source="createdAt" label="Inscrit le" />
    </Datagrid>
  </List>
);

const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="lastName" label="Nom" />
      <TextInput source="email" label="Email" />
      <TextInput source="role" label="Rôle" />
    </SimpleForm>
  </Edit>
);

const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="lastName" label="Nom" />
      <TextInput source="email" label="Email" />
      <TextInput source="password" label="Mot de passe" />
      <TextInput source="role" label="Rôle" defaultValue="user" />
    </SimpleForm>
  </Create>
);

// ============================================
// COMPOSANTS SALLES
// ============================================
const RoomList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom de la salle" />
    </Datagrid>
  </List>
);

const RoomEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nom de la salle" />
    </SimpleForm>
  </Edit>
);

const RoomCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nom de la salle" />
    </SimpleForm>
  </Create>
);

// ============================================
// COMPOSANTS ÉVÉNEMENTS
// ============================================
const EventList = () => (
  <List>
    <Datagrid>
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Date de début" />
      <DateField source="endDate" label="Date de fin" />
      <TextField source="description" label="Description" />
    </Datagrid>
  </List>
);

const EventEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" label="Titre" />
      <TextInput source="location" label="Lieu" />
      <DateInput source="startDate" label="Date de début" />
      <DateInput source="endDate" label="Date de fin" />
      <TextInput source="description" label="Description" multiline rows={4} />
    </SimpleForm>
  </Edit>
);

const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Titre" />
      <TextInput source="location" label="Lieu" />
      <DateInput source="startDate" label="Date de début" />
      <DateInput source="endDate" label="Date de fin" />
      <TextInput source="description" label="Description" multiline rows={4} />
    </SimpleForm>
  </Create>
);

// ============================================
// BOUTON DE DÉCONNEXION
// ============================================
function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      startIcon={<LogoutIcon />}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300,
        background: 'linear-gradient(135deg, #d4af37 0%, #b8942e 100%)',
        color: '#0f172a',
        fontWeight: 600,
        borderRadius: '50px',
        padding: '10px 24px',
        textTransform: 'none',
        fontSize: '0.9rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
          background: 'linear-gradient(135deg, #e2c04a 0%, #c4a235 100%)',
        },
      }}
    >
      <LogoutIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
      Déconnexion
    </Button>
  );
}

// ============================================
// PAGE ADMIN
// ============================================
export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsRefresh, setStatsRefresh] = useState(0);

  useEffect(() => {
    (window as any).refreshDashboardStats = () => {
      setStatsRefresh(prev => prev + 1);
    };
    return () => {
      delete (window as any).refreshDashboardStats;
    };
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/admin/login');
    } else {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <ThemeProvider theme={theme}>
      <DashboardStats refreshTrigger={statsRefresh} />
      <StatsCharts />
      <Admin
        dataProvider={dataProvider as any}
        authProvider={authProvider as any}
        layout={() => <></>}
      >
        <Resource
          name="users"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          options={{ label: '👥 Utilisateurs' }}
        />
        <Resource
          name="rooms"
          list={RoomList}
          edit={RoomEdit}
          create={RoomCreate}
          options={{ label: '🏢 Salles' }}
        />
        <Resource
          name="events"
          list={EventList}
          edit={EventEdit}
          create={EventCreate}
          options={{ label: '📅 Événements' }}
        />
      </Admin>
      <LogoutButton />
    </ThemeProvider>
  );
}