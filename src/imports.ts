const zlibPromise = import('node:zlib')

export let zlib: Awaited<typeof zlibPromise>

zlibPromise
  .then((module) => {
    zlib = module
  })
  .catch(() => null)
