var Hapi = require('hapi')
var server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: 3000
})


server.register({
  register: require('inert')
}, function(err) {
  if (err) throw err

  server.start(function(err) {
    console.log('Server started at: ' + server.info.uri)
  })
})

server.route({
  method: 'GET',
  path: '/js/{file*}',
  handler: {
    directory: {
      path: 'public/js',
      listing: true
    }
  }
})
