## Getting Started

Requirements

1. pusher.com account
2. vercel deployment
3. local-ssl-proxy for localhost development 

Adding new sounds
1. Audacity
2. yt-dlp to download youtube
  1. mkvextract <file> tracks 1:audio.webm # extract audio track
  2. ffmpeg -i audio.webm -c:a flac audio.flac
3. export to m4a for highest quality
4. ffmpeg -i sounds.m4a sounds.webm