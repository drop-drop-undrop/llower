export default function PageAddress(handler = {}) {
  async function requestAuthorization({
    state,
    codeChallenge,
  }) {
    try {
      const url = new URL('https://twitter.com/i/oauth2/authorize')
      url.searchParams.set('client_id', 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ')
      url.searchParams.set('redirect_uri', process.env.REACT_APP_REDIRECT_URI)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('scope', [
        'users.read',
        'tweet.read',
        'follows.read',
        'follows.write',
        'offline.access',
      ].join(' '))
      url.searchParams.set('code_challenge_method', 'plain')
      url.searchParams.set('code_challenge', codeChallenge)
      url.searchParams.set('state', state)

      setTimeout(() => window.location.assign(url), 0)

      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      }
    }
  }

  async function requestAuthorizationEffect() {
    const url = new URL(window.location.href)
    const givenState = url.searchParams.get('state')
    const code = url.searchParams.get('code')

    return {
      ok: true,
      givenState,
      code,
    }
  }

  async function requestAuthorizationEffectRemoval() {
    const url = new URL(window.location.href)
    url.searchParams.delete('error')
    url.searchParams.delete('state')
    url.searchParams.delete('code')
    window.history.replaceState({}, '', url)

    return { ok: true }
  }

  return {
    ...handler,
    requestAuthorization,
    requestAuthorizationEffect,
    requestAuthorizationEffectRemoval,
  }
}
