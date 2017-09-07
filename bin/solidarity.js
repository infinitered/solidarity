// ready
const { build } = require('gluegun')

// aim
const runtime = build()
  .brand('movie')
  .configFile('./movie.toml')
  .loadDefault(`${__dirname}/core-plugins`)
  .load('~/Desktop/movie/quote')
  .load('~/Desktop/movie/credits')
  .loadAll('~/Downloads/VariousMoviePlugins')
  .createRuntime()

// fire!
runtime.run()
