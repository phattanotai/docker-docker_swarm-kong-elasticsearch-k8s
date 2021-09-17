const fastify = require('fastify')

const env = process.env.NODE_ENV || 'development'
console.log(process.env)
const app = fastify({
    logger: true
})

app.register(require('fastify-cors'), { 
    origin: "*",
    methods: ["POST","GET"]
})
  
app.get('/user', () => {
    return {
        data: {name: "test",email: "test@gmail.com"},
        status: true,
        env
    }
})

app.get('/allUser', () => {
    return {
        data: [
            {name: "test",email: "test@gmail.com"},
            {name: "test",email: "test@gmail.com"},
            {name: "test",email: "test@gmail.com"},
            {name: "test",email: "test@gmail.com"},
        ],
        status: true,
        env
    }
})

app.listen(3000,'0.0.0.0')