15:25:36 [200] /terms 270ms
node:events:496
      throw er; // Unhandled 'error' event
      ^

Error: EBUSY: resource busy or locked, lstat 'C:\DumpStack.log.tmp'
Emitted 'error' event on FSWatcher instance at:
    at FSWatcher._handleError (file:///C:/Users/Administrator/Documents/FLUXFUSE%20TECHNOLOGIES/WEBSITE/FFTL-light-astro-theme/node_modules/vite/dist/node/chunks/node.js:10606:146)
    at NodeFsHandler._boundHandleError (file:///C:/Users/Administrator/Documents/FLUXFUSE%20TECHNOLOGIES/WEBSITE/FFTL-light-astro-theme/node_modules/vite/dist/node/chunks/node.js:9563:44)
    at ReaddirpStream.emit (node:events:518:28)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  errno: -4082,
  code: 'EBUSY',
  syscall: 'lstat',
  path: 'C:\\DumpStack.log.tmp'
}

Node.js v22.14.0