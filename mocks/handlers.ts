import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:5000/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          name: 'America',
          ImagePath: '/images/america.jpeg',
        },
        {
          name: 'England',
          ImagePath: '/images/england.jpeg',
        },
      ]),
    );
  }),
  rest.get('http://localhost:5000/options', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          name: 'Insurance',
        },
        {
          name: 'Dinner',
        },
      ]),
    );
  }),
];
