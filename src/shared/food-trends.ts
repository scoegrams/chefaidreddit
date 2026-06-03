export type FoodTrendPost = {
  subreddit: string;
  title: string;
  score: number;
  numComments: number;
  permalink: string;
};

export type FoodTrendsResponse = {
  type: 'food-trends';
  cached: boolean;
  posts: FoodTrendPost[];
};
