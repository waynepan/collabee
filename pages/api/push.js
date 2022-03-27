// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Pusher from 'pusher'

export default async function handler(req, res) {
  const pusher = new Pusher({
    appId: '1368034',
    key: '31e9185cd7028f216191',
    cluster: 'us3',
    secret: process.env.PUSHER_SECRET
  })

  await pusher.trigger('collabee', 'play-sound', {
    effect: req.body.effect,
    name: req.body.name,
    ts: Date.now()
  })

  return res.status(200).end()
}
