// backend/src/utils/syncSequences.js
const pool = require('../db');

/**
 * Synchronise toutes les séquences avec les valeurs max des tables
 * Pour éviter les erreurs de clé dupliquée
 */
async function syncAllSequences() {
  console.log('🔄 Synchronisation des séquences...');
  
  try {
    // Liste des tables avec leurs séquences
    const tables = [
      { table: 'sessions', sequence: 'sessions_id_seq' },
      { table: 'events', sequence: 'events_id_seq' },
      { table: 'rooms', sequence: 'rooms_id_seq' },
      { table: 'speakers', sequence: 'speakers_id_seq' },
      { table: 'users', sequence: 'users_id_seq' },
      { table: 'questions', sequence: 'questions_id_seq' },
      { table: 'answers', sequence: 'answers_id_seq' },
    ];

    for (const { table, sequence } of tables) {
      try {
        // Vérifier si la table existe
        const tableCheck = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          )
        `, [table]);

        if (!tableCheck.rows[0].exists) {
          console.log(`⚠️ Table ${table} n'existe pas, ignorée`);
          continue;
        }

        // Vérifier si la séquence existe
        const seqCheck = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.sequences 
            WHERE sequence_name = $1
          )
        `, [sequence]);

        if (!seqCheck.rows[0].exists) {
          console.log(`⚠️ Séquence ${sequence} n'existe pas, ignorée`);
          continue;
        }

        // Récupérer la valeur max de la table
        const maxResult = await pool.query(`
          SELECT COALESCE(MAX(id), 0) as max_id FROM ${table}
        `);
        const maxId = parseInt(maxResult.rows[0].max_id);

        // Récupérer la valeur actuelle de la séquence
        const seqResult = await pool.query(`
          SELECT currval($1) as current_val
        `, [sequence]);

        const currentSeq = parseInt(seqResult.rows[0].current_val);

        // Si la séquence est en dessous du max, la réinitialiser
        if (currentSeq <= maxId) {
          const newVal = maxId + 1;
          await pool.query(`
            SELECT setval($1, $2)
          `, [sequence, newVal]);
          
          console.log(`✅ ${table}: séquence ${sequence} réinitialisée de ${currentSeq} à ${newVal}`);
        } else {
          console.log(`✅ ${table}: séquence ${sequence} OK (${currentSeq} > ${maxId})`);
        }

      } catch (error) {
        // Si currval n'a pas été initialisé, on force la séquence
        if (error.message.includes('currval is not yet defined')) {
          try {
            const maxResult = await pool.query(`
              SELECT COALESCE(MAX(id), 0) as max_id FROM ${table}
            `);
            const maxId = parseInt(maxResult.rows[0].max_id);
            const newVal = maxId + 1;
            
            await pool.query(`
              SELECT setval($1, $2)
            `, [sequence, newVal]);
            
            console.log(`✅ ${table}: séquence ${sequence} initialisée à ${newVal}`);
          } catch (e) {
            console.error(`❌ Erreur initialisation ${table}:`, e.message);
          }
        } else {
          console.error(`❌ Erreur synchro ${table}:`, error.message);
        }
      }
    }

    console.log('✅ Synchronisation des séquences terminée');
  } catch (error) {
    console.error('❌ Erreur synchronisation séquences:', error);
  }
}

module.exports = { syncAllSequences };