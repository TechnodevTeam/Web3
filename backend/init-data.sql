TRUNCATE TABLE
    questions,
    session_speakers,
    sessions,
    speakers,
    rooms,
    events,
    admins,
    users
RESTART IDENTITY CASCADE;

INSERT INTO admins (email, password)
VALUES
    ('admin@eventsync.com', 'admin123');

INSERT INTO events (title, description, start_date, end_date, location)
VALUES
    (
        'EventSync Demo Day',
        'Un événement de démonstration pour tester la plateforme EventSync.',
        CURRENT_DATE,
        CURRENT_DATE,
        'Antananarivo'
    ),
    (
        'Tech Conference Madagascar 2026',
        'Conférence autour du développement web, du backend, de l''IA et de la cybersécurité.',
        DATE '2026-06-10',
        DATE '2026-06-12',
        'Antananarivo, Madagascar'
    ),
    (
        'Workshop Fullstack React Spring Boot',
        'Atelier pratique pour apprendre à créer une application fullstack.',
        DATE '2026-07-05',
        DATE '2026-07-05',
        'HEI Madagascar'
    );

INSERT INTO rooms (name)
VALUES
    ('Salle A'),
    ('Salle B'),
    ('Salle C'),
    ('Salle Principale'),
    ('Amphithéâtre');

INSERT INTO speakers (full_name, photo_url, bio, external_links)
VALUES
    (
        'Jean Rakoto',
        'https://example.com/photos/jean-rakoto.jpg',
        'Développeur backend spécialisé en Java Spring Boot et PostgreSQL.',
        'https://github.com/jeanrakoto'
    ),
    (
        'Mialy Rasoanaivo',
        'https://example.com/photos/mialy-rasoanaivo.jpg',
        'Développeuse frontend spécialisée en React, Vite et design UI.',
        'https://linkedin.com/in/mialyrasoanaivo'
    ),
    (
        'Hery Andrianina',
        'https://example.com/photos/hery-andrianina.jpg',
        'Ingénieur logiciel spécialisé en architecture fullstack.',
        'https://hery-dev.com'
    ),
    (
        'Sarah Randria',
        'https://example.com/photos/sarah-randria.jpg',
        'Experte en cybersécurité et protection des applications web.',
        'https://linkedin.com/in/sarahrandria'
    ),
    (
        'Toky Raveloson',
        'https://example.com/photos/toky-raveloson.jpg',
        'Développeur JavaScript spécialisé en Node.js et Express.',
        'https://github.com/tokyraveloson'
    );

INSERT INTO sessions (
    event_id,
    room_id,
    title,
    description,
    start_time,
    end_time,
    capacity
)
VALUES
    (
        1,
        1,
        'Présentation de EventSync',
        'Introduction générale au projet EventSync et à ses fonctionnalités principales.',
        CURRENT_TIMESTAMP - INTERVAL '30 minutes',
        CURRENT_TIMESTAMP + INTERVAL '1 hour',
        80
    ),
    (
        1,
        2,
        'Questions/Réponses en direct',
        'Session pour tester le système de questions et upvotes.',
        CURRENT_TIMESTAMP + INTERVAL '2 hours',
        CURRENT_TIMESTAMP + INTERVAL '3 hours',
        60
    ),
    (
        2,
        4,
        'Introduction à React avec Vite',
        'Découverte de React, des composants, du state et de Vite.',
        TIMESTAMP '2026-06-10 09:00:00',
        TIMESTAMP '2026-06-10 10:30:00',
        120
    ),
    (
        2,
        1,
        'Créer une API REST avec Spring Boot',
        'Création d''une API REST structurée avec Controller, Service et Repository.',
        TIMESTAMP '2026-06-10 11:00:00',
        TIMESTAMP '2026-06-10 12:30:00',
        100
    ),
    (
        2,
        2,
        'PostgreSQL pour les projets web',
        'Modélisation des tables, relations, clés étrangères et requêtes SQL.',
        TIMESTAMP '2026-06-10 14:00:00',
        TIMESTAMP '2026-06-10 15:30:00',
        90
    ),
    (
        2,
        3,
        'Sécurité des applications web',
        'Comprendre les bases de l''authentification et de la sécurité web.',
        TIMESTAMP '2026-06-11 09:00:00',
        TIMESTAMP '2026-06-11 10:30:00',
        80
    ),
    (
        3,
        5,
        'Projet Fullstack de A à Z',
        'Construire une application complète avec frontend, backend et base de données.',
        TIMESTAMP '2026-07-05 08:30:00',
        TIMESTAMP '2026-07-05 12:00:00',
        150
    );

INSERT INTO session_speakers (session_id, speaker_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (2, 3),
    (3, 2),
    (4, 1),
    (4, 3),
    (5, 1),
    (6, 4),
    (7, 2),
    (7, 3),
    (7, 5);

INSERT INTO questions (session_id, content, author_name, upvotes)
VALUES
    (
        1,
        'Est-ce que les participants doivent créer un compte pour poser une question ?',
        'Mahefa',
        5
    ),
    (
        1,
        'Comment détecter automatiquement qu''une session est live ?',
        'Anonyme',
        8
    ),
    (
        1,
        'Les favoris sont-ils stockés dans la base de données ?',
        NULL,
        3
    ),
    (
        1,
        'Est-ce que l''admin peut modifier une session après sa création ?',
        'Tiana',
        2
    ),
    (
        2,
        'Peut-on empêcher une personne de voter plusieurs fois ?',
        'Rado',
        1
    );