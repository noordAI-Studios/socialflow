function exportPostsToCSV(posts) {
  const headers = ['Titre','Plateforme','Caption','Image URL','Prompt IA','Statut','Date Publication'];
  const rows = posts.map(p => [
    p.title,
    p.platform,
    p.caption,
    p.imageUrl || 'Image uploadée',
    p.aiPrompt,
    p.status,
    p.publishDate
  ]);
  return [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
}

module.exports = { exportPostsToCSV };
