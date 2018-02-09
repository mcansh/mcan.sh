import createStore from 'unistore';

export const store = createStore({ dark: false });

export const actions = () => ({
  toggleDark: ({ dark }) => ({ dark: !dark }),
});
