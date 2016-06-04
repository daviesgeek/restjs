Rest.Config.set({
  baseUrl: 'http://jsonplaceholder.typicode.com',
  withCredentials: true,
})

Rest.addResponseInterceptor(function(data, responseType, route, responseUrl, reject) {})

Rest.addResponseExtractor(function(response) {
  return response
})

var Posts = Rest.factory('posts')

var post = Posts.create({name: "Matthew"})
post.post()
post.patch({description: "Davies"})

// Posts.getList({with: 'all'}).then(function(posts) {
//   // posts[0].get()
//   // posts[0].post()
//   // posts[0].patch()
//   // posts[0].put()
// }).catch(function(response) {
//   // console.log(response)
// })

// Posts.get(1).then(function(post) {
//   console.log(post)
// })