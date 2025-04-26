import { createCookie } from 'react-router'

const cookie = createCookie('user-prefs', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 60_000),
  maxAge: 60,
  secrets: ['s3cret1'],
})

cookie.serialize(userPrefs)
cookie.serialize(userPrefs, { sameSite: 'strict' })
