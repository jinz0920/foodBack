// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: {
        prettyPrint: true
    }
})
require('dotenv').config()

const{authenticateAdmin}=require('./decorators')

// const{authenticateJWT}=require('./decorators')


fastify.register(require('fastify-jwt'), {
    secret: 'process.env.SECRET'
})
console.log(process.env.SECRET)

fastify.register(require('fastify-cors'), {
    origin: 'http://localhost:3000'
})

async function authenticateJWT(request, reply) {
    try {
        // const decoded = fastify.jwt.verify(request.query.token)
        const decoded = await request.jwtVerify()
        // cette méthode va vérifier si un token est présent dans le header. Si aucun token n'est présent ou que ce token est invalide, alors on retourne une erreur 500
        return decoded
    } catch (error) {
        reply.code(500).send(error)
    }
}


fastify.decorate('authenticate', authenticateJWT)
fastify.decorate('authenticateAdmin', authenticateAdmin)


fastify.register(require('fastify-mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,

    url: process.env.MONGO_DB_URL
})

fastify.register(require('./routes/courses'))
fastify.register(require('./routes/users'))
fastify.register(require('./routes/private'))



// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})
fastify.get('/me', async (request, reply) => {
    return {
        id: 01,
        firstName: 'jin',
        lastName: 'zhang',
        email: 'jin@yahoo.fr'
    }
})
fastify.get('/test', async (request, reply) => {
    return "ceci est un message"
})





// Run the server!
const start = async () => {
    try {
        await fastify.listen(5000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()