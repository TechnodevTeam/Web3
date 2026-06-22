// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simuler une base de données avec un fichier JSON (ou utilisez votre vraie BD)
import fs from 'fs';
import path from 'path';

const FAVORITES_FILE = path.join(process.cwd(), 'data', 'favorites.json');

// Lire les favoris depuis le fichier
function readFavorites() {
  try {
    if (!fs.existsSync(FAVORITES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(FAVORITES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Écrire les favoris dans le fichier
function writeFavorites(favorites: any[]) {
  const dir = path.dirname(FAVORITES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

// GET - Récupérer tous les favoris
export async function GET() {
  try {
    const favorites = readFavorites();
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de chargement' }, { status: 500 });
  }
}

// POST - Ajouter un favori
export async function POST(request: NextRequest) {
  try {
    const { sessionId, session } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
    }

    const favorites = readFavorites();
    
    // Vérifier si déjà existant
    const exists = favorites.some((f: any) => f.sessionId === sessionId);
    if (exists) {
      return NextResponse.json(favorites.find((f: any) => f.sessionId === sessionId));
    }

    const newFavorite = {
      id: Date.now().toString(),
      userId: 'user-1',
      sessionId,
      session,
      createdAt: new Date().toISOString()
    };

    favorites.push(newFavorite);
    writeFavorites(favorites);

    return NextResponse.json(newFavorite);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur d\'ajout' }, { status: 500 });
  }
}

// DELETE - Supprimer un favori
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
    }

    let favorites = readFavorites();
    favorites = favorites.filter((f: any) => f.sessionId !== sessionId);
    writeFavorites(favorites);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de suppression' }, { status: 500 });
  }
}