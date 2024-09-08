# Career Path Explorer

Career Path Explorer is a Next.js application designed to help users explore various career options and receive personalized career recommendations based on their interests, skills, and age group. The application uses data from the Bureau of Labor Statistics (BLS) and leverages AI to provide tailored career advice.

## Features

### Current Features
- [x] Occupation data scraping from BLS website
- [x] Explore page with occupation statistics
- [x] Personalized career recommendations
- [x] Multi-step form for user input
- [x] AI-powered career suggestions using OpenAI's GPT-4
- [x] Responsive design with Tailwind CSS

### Upcoming Features
- [ ] User authentication and profile management
- [ ] Save and compare multiple career paths
- [ ] Integration with job search APIs
- [ ] Detailed career path visualizations
- [ ] Educational resource recommendations
- [ ] Community forum for career discussions
- [ ] Mobile app version

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `pages/`: Contains the main pages of the application
  - `index.tsx`: Home page
  - `explore.tsx`: Occupation statistics and exploration page
  - `personalized.tsx`: Personalized career recommendation page
  - `api/`: API routes
    - `data.ts`: Endpoint for fetching occupation data
    - `generate-recommendations.ts`: AI-powered recommendation generation
- `utils/`: Utility functions
  - `dataLoader.ts`: Functions for scraping and processing occupation data
- `components/`: Reusable React components (to be implemented)
- `styles/`: Global styles and Tailwind CSS configuration

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Cheerio (for web scraping)
- OpenAI API (GPT-4)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
