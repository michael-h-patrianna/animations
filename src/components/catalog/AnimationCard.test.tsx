import { AnimationCard } from '@/components/catalog/AnimationCard';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';

describe('AnimationCard', () => {
  it('displays header information and triggers replay handler', async () => {
    const onReplay = jest.fn();
    const mountSpy = jest.fn();

    function SampleAnimation() {
      useEffect(() => {
        mountSpy();
      }, []);

      return <div data-testid="demo">demo</div>;
    }

    render(
      <AnimationCard
        title="Sample Animation"
        description="Example description"
        animationId="sample__animation"
        onReplay={onReplay}
      >
        <SampleAnimation />
      </AnimationCard>
    );

    expect(screen.getByText('Sample Animation')).toBeInTheDocument();
    expect(screen.getByText('Example description')).toBeInTheDocument();
    expect(screen.getByText('sample__animation')).toBeInTheDocument();
    expect(screen.getByTestId('demo')).toBeInTheDocument();
    expect(mountSpy).toHaveBeenCalledTimes(1);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /replay/i }));

    await waitFor(() => {
      expect(onReplay).toHaveBeenCalledTimes(1);
      expect(mountSpy).toHaveBeenCalledTimes(2);
    });
  });
});
