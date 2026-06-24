// backend/scripts/fixSequences.js
const { syncAllSequences } = require('../src/utils/syncSequences');

console.log('🔄 Réparation des séquences...');
syncAllSequences()
  .then(() => {
    console.log('✅ Réparation terminée');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });