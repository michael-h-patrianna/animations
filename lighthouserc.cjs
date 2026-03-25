module.exports = {
  ci: {
    collect: {
      url: ['http://127.0.0.1:4173/'],
      startServerCommand: 'npx vite preview --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Skip SEO — not relevant for an internal animation catalog
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
