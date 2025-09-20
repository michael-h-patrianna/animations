import App from '@/App';
import { render, screen, within } from '@testing-library/react';

describe('App', () => {
  it('renders categories, groups, and animation cards from the catalog', async () => {
    render(<App />);

    const categoryHeading = await screen.findByRole('heading', {
      name: /Dialog & Modal Animations/i
    });
    expect(categoryHeading).toBeInTheDocument();

    const groupHeading = await screen.findByRole('heading', {
      level: 2,
      name: 'Base modal animations'
    });
    const groupSection = groupHeading.closest('article');
    expect(groupSection).not.toBeNull();

    const groupQueries = within(groupSection!);

    expect(await groupQueries.findByText('Gentle Scale Pop')).toBeInTheDocument();

    expect(
      (await groupQueries.findAllByRole('button', { name: /replay/i })).length
    ).toBeGreaterThan(0);
  });
});
