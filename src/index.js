const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
   
  },
  Mutation: {
    // 2
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
    updateLink: (root, args) => {
        const index = links.findIndex(x => x.id == args.id);
        
            const link = links[index];
            link.description = args.description;
            link.url = args.url
            links.splice(index, 1, link);
        return link
    },
    deleteLink: (root, {id}) => {
        const index = links.findIndex(x => x.id == id);
        const link = links[index];
        links.splice(index, 1);
        return link;
    }
  },
  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  }
}

// 3
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/onwuzulikee1-dd62a1/database/dev',
      secret: 'mysecret123',
      debug: true,
    })
  })
})
server.start(() => console.log(`Server is running on http://localhost:4000`))