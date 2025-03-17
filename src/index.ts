import { ApolloServer } from "apollo-server";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/type-defs";
import { db, seedDatabase } from "./db";
import { createDataLoaders } from "./data-loaders/index";

async function startServer() {
  // Seed the database
  await seedDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
      return {
        dataloaders: createDataLoaders(),
        db: db,
      };
    },
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
