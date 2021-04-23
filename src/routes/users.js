const argon2 = require('argon2')

const Ajv = require('ajv');



const createError = require('http-errors')
async function routes(fastify, options) {
    const optsPost = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    password: { type: 'string' },
                    role: {
                        type: 'string',
                    }
                },
                required: ['email', 'password'],
                additionalProperties: false,
            }
        }
    }
    fastify.post('/users', optsPost, async (request, reply) => {
        const { email, password } = request.body
        const db = fastify.mongo.db
        const collection = db.collection('users')
        const userExists = await collection.findOne({ email: email })
        if (userExists) throw new createError.Conflict('Email already exists')
        const hashedPassword = await argon2.hash(password)
        const resultat = await collection.insertOne({ ...request.body, password: hashedPassword, role: 'member' })
        return { id: resultat.ops[0]._id }
    })
    const optsLogin = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['email', 'password'],
                additionalProperties: false,
            }
        }
    }
    fastify.post('/login', optsLogin, async (request, reply) => {
        const { email, password } = request.body
        const db = fastify.mongo.db
        const collection = db.collection('users')
        const user = await collection.findOne({ email: email })
        if (!user) throw new createError.Conflict('Email non trouvé ou passsword erroné')
        const match = await argon2.verify(user.password, password)
        if (!match) throw new createError.Conflict('Email non trouvé ou passsword erroné')
        const token = await reply.jwtSign({
            id: user._id,
            role: user.role,
            expiresIn: "10m"
        })
        reply.code(200).send({ token })
    })

}

module.exports = routes