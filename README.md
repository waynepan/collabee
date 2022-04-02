# Collabee

A customizable collaborative soundboard to make Zoom meetings less boring.

## Demo
Live demo available at [collabee.app](https://collabee.app).


## Getting Started

### Requirements

1. [Vercel](https://https://vercel.com/) as hosting
2. [Pusher](https://pusher.com/) for realtime channels
3. Google OAuth client
4. for localhost development, recommend using [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy)

The following environment variables are required
```
NEXT_PUBLIC_AUDIO_PACK_SRC # uri of audio pack

GOOGLE_SECRET # Google OAuth client info
GOOGLE_ID # Google OAuth client info

NEXTAUTH_SECRET # random secret string

# Pusher configs and secrets
PUSHER_SECRET
NEXT_PUBLIC_PUSHER_APP_ID
NEXT_PUBLIC_PUSHER_KEY
NEXT_PUBLIC_PUSHER_CLUSTER
```


### Adding new sounds

1. Download [Audacity](https://www.audacityteam.org/)
2. For YouTube, use [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download clip
    1. to extract the audio only `mkvextract <file> tracks 1:audio.webm`
    2. convert to lossless flac to import into Audacity `ffmpeg -i audio.webm -c:a flac audio.flac`
3. Append the audio clip to the main audio pack
4. Export from Audacity to m4a at highest quality
5. (optional) convert to .webm for better compression `ffmpeg -i sounds.m4a sounds.webm`