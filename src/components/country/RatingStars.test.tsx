import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RatingStars } from './RatingStars';

describe('RatingStars', () => {
  it('calls onChange with the clicked star value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={2} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '4 stars' }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('clears the rating when clicking the currently selected star', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={3} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '3 stars' }));

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('renders 5 star buttons within a labeled group', () => {
    render(<RatingStars value={0} onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Rating' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('does not call onChange when readonly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={3} onChange={onChange} readonly />);

    await user.click(screen.getByRole('button', { name: '5 stars' }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
