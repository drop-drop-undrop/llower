export default function AddressBar(handler = {}) {
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

      return {
        ifUnauthorized: (handle) => { },
        ifOk: (handle) => { handle() },
        ifNotOk: (handle) => { },
      }
    } catch (error) {
      return {
        ifUnauthorized: (handle) => { },
        ifOk: (handle) => { },
        ifNotOk: (handle) => {
          handle(error.message)
        },
      }
    }
  }

  async function requestTokens({
    savedState,
    codeChallenge,
  }) {
    const url = new URL(window.location.href)
    url.searchParams.delete('error')
    const givenState = url.searchParams.get('state')
    url.searchParams.delete('state')
    const code = url.searchParams.get('code')
    url.searchParams.delete('code')
    window.history.replaceState({}, '', url)

    const response = await handler.requestTokens({
      savedState,
      codeChallenge,
      givenState,
      code,
    })

    return response
  }

  return {
    ...handler,
    requestAuthorization,
    requestTokens,
  }
}
