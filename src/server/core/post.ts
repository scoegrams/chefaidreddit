import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'ChefAid — pizza, tacos & fried food trends this month',
  });
};
