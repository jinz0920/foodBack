const { categories } = require('../db')

const createError = require('http-errors')

const { ObjectId } = require('mongodb')

async function route(fastify, options) {


    fastify.get('/courses', async (request, reply) => {
        const db = fastify.mongo.db
        const collection = db.collection('courses')
        const resultat = await collection.find().toArray()
        return resultat

    })
    const opts = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    picture: { type: 'string' },
                    description: { type: 'string' },
                    price: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 100000,
                    },
                    cuisine: {
                        type: 'array',
                        minItems: 1,
                        maxItems: 6,
                        uniqueItems: true,
                        Items: {
                            type: 'string',
                            enum: categories
                        }
                    },
                    popular: {
                        type: 'boolean',
                        default: false
                    },
                    rating: {
                        type: 'integer',
                        nullable: true,
                        default: null,
                    },
                    rating_total: {
                        type: 'integer',
                        default: 0,
                    },
                    rating_voters: {
                        type: 'integer',
                        default: 0,

                    }
                },
                required: ['name', 'description', 'picture', 'price', 'cuisine'],
                additionalProperties: false,
            }
        }
    }
    fastify.route({
        method: 'POST',
        url: '/courses',
        schema: opts.schema,
        preValidation:fastify.authenticateAdmin,
        handler: async (request, reply) => {
            const db = fastify.mongo.db
            const collection = db.collection('courses')
            const resultat = await collection.insertOne(request.body)
            return resultat.ops[0]
    
        }
    })
    // fastify.post('/courses', opts, async (request, reply) => {
    //     const db = fastify.mongo.db
    //     const collection = db.collection('courses')
    //     const resultat = await collection.insertOne(request.body)
    //     return resultat.ops[0]

    // })
    fastify.get('/courses/:id', async (request, reply) => {
        try {

            const db = fastify.mongo.db
            const collection = db.collection('courses')
            const resultat = await collection.findOne({
                _id: new ObjectId(request.params.id)
            })

            if (resultat === null) {
                // reply.code(404).send({error: true})
                throw new createError.NotFound()/* méthode http-errors npm */
            }
            return resultat
        } catch (error) {
            throw new createError.InternalServerError('Oops problème!!!!!!')
        }

    })

    const optsPatch = {
        schema: {
            body: {
                ...opts.schema.body, required: [],
            }
        }
    }

    fastify.patch('/courses/:id', optsPatch, async (request, reply) => {
        const db = fastify.mongo.db
        const collection = db.collection('courses')
        const result = await collection.findOneAndUpdate({
            _id: new ObjectId(request.params.id)
        },
            {
                $set: request.body
            },
            {
                returnOriginal: false
            })
        if (!result.value) {
            throw new createError.NotFound()
        }
        const resultPatch = { ...result.value, rating: undefined, popular: undefined, rating_total: undefined }
        return resultPatch
    })
    fastify.delete('/courses/:id', async (request, reply) => {
        try {
            const db = fastify.mongo.db
            const collection = db.collection('courses')
            const result = await collection.findOneAndDelete({
                _id: new ObjectId(request.params.id)
            })

            if (!result.value) {
                throw new createError.NotFound()
            }

            return 'ok'

        } catch (error) {
            throw new createError.InternalServerError('Oops problème!!!!!!')
        }

    })

}
module.exports = route