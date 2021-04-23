async function routes(fastify, options) {
    fastify.addHook('onRequest', fastify.authenticate)

    fastify.get('/private', async (request, reply) => {
        return 'you are authenticated'
    })
}

module.exports = routes