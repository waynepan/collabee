// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Pusher from 'pusher'

export default async function handler(req, res) {
  console.log(process.env.NEXT_PUBLIC_PUSHER_APP_ID)
  const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    secret: process.env.PUSHER_SECRET
  })

  await pusher.trigger('collabee', 'play-sound', {
    effect: req.body.effect,
    email: req.body.email,
    name: req.body.name,
    ts: Date.now()
  })

  return res.status(200).end()
}
