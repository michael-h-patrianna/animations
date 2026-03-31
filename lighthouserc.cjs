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
        // Animation-heavy catalog: 0.8 is a realistic floor.
        // Failing CI on regression is more useful than a warning nobody reads.
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
