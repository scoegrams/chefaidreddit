import { useEffect, useState } from 'react';
import type { FoodTrendsResponse } from '../../shared/food-trends';

type FoodTrendsState = {
  posts: FoodTrendsResponse['posts'];
  cached: boolean;
  loading: boolean;
  error: string | null;
};

export const useFoodTrends = () => {
  const [state, setState] = useState<FoodTrendsState>({
    posts: [],
    cached: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/food-trends');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: FoodTrendsResponse = await res.json();
        if (data.type !== 'food-trends') throw new Error('Unexpected response');
        setState({
          posts: data.posts,
          cached: data.cached,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Failed to load food trends', err);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Could not load trends. Try again in a moment.',
        }));
      }
    };
    void load();
  }, []);

  return state;
};
