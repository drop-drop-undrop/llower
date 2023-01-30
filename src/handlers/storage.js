export default function Storage(handler = {}) {
  const _clear = () => {
    localStorage.removeItem('tokens')
    localStorage.removeItem('user')
    localStorage.removeItem('is_following')
  }

  async function requestDump() {
    return {
      ifUnauthorized: (handle) => { },
      ifOk: (handle) => {
        handle({
          tokens: JSON.parse(localStorage.getItem('tokens')),
          user: JSON.parse(localStorage.getItem('user')),
          isFollowing: localStorage.getItem('is_following') === 'true',
        })
      },
      ifNotOk: (handle) => { },
    }
  }

  async function requestAuthorization({
    codeChallenge,
    state,
  }) {
    localStorage.setItem('state', state)
    localStorage.setItem('code_challenge', codeChallenge)

    const response = await handler.requestAuthorization({
      codeChallenge,
      state,
    })

    return response
  }

  async function requestTokens() {
    const savedState = localStorage.getItem('state')
    localStorage.removeItem('state')
    const codeChallenge = localStorage.getItem('code_challenge')
    localStorage.removeItem('code_challenge')

    const response = await handler.requestTokens({
      savedState,
      codeChallenge,
    })

    response.ifUnauthorized(_clear)
    response.ifOk((newTokens) => {
      localStorage.setItem('tokens', JSON.stringify(newTokens))
    })

    return response
  }

  async function requestRevocationOfTokens({ tokens }) {
    setTimeout(_clear, 0)

    const response = handler.requestRevocationOfTokens({ tokens })

    return response
  }

  async function requestUser({ tokens }) {
    const response = await handler.requestUser({ tokens })

    response.ifUnauthorized(_clear)
    response.ifOk((newUser) => {
      localStorage.setItem('user', JSON.stringify(newUser))
    })

    return response
  }

  async function requestFollowingOfNasa({ tokens, user }) {
    const response = await handler.requestFollowingOfNasa({
      tokens,
      user,
    })

    response.ifUnauthorized(_clear)
    response.ifOk(() => localStorage.setItem('is_following', true))

    return response
  }

  async function requestUnfollowingOfNasa({ tokens, user }) {
    const response = await handler.requestUnfollowingOfNasa({
      tokens,
      user,
    })

    response.ifUnauthorized(_clear)
    response.ifOk(() => localStorage.setItem('is_following', false))

    return response
  }

  return {
    ...handler,
    requestDump,
    requestAuthorization,
    requestTokens,
    requestRevocationOfTokens,
    requestUser,
    requestFollowingOfNasa,
    requestUnfollowingOfNasa,
  }
}
