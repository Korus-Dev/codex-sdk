# First conversation

Register notification and approval handlers, start the transport, initialize the connection, then create a thread and start a turn. This example prints streamed text and declines command execution requests.

<<< @/examples/quick-start.ts

`initialize()` sends the required `initialized` notification automatically. Registering the completion listener before `turn/start` avoids losing a fast completion notification. A `turn/start` response admits the turn; the `turn/completed` notification carries its final status.

The example waits for completion with a five-minute deadline and closes the owned process in `finally`. Your app can use its own deadline and cancellation policy. See [stream events](/guide/streaming) for live rendering, [threads and turns](/guide/conversations) for history and interruption, and [reconnect and recover](/guide/recovery) for connection loss.
