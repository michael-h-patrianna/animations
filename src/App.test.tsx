import App from '@/App';
import { render } from '@testing-library/react';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
