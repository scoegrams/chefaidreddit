import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'ChefAid — culinary trends this month (pizza, ramen, sushi & more)',
  });
};
