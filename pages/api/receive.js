// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  new Pusher(process.env.pusher_key, {
    cluster: process.env.pusher_cluster
  })

  pusher.channels.subscribe(PUSHER_CHANNEL)

  pusher.bind(PUSHER_EVENT, (data) => {
    console.log(data)
  })

  res.status(200).json({ name: 'John Doe' })
}
