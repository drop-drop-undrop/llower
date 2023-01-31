export default function Storage(handler = {}) {
  const _clear = () => {
    localStorage.removeItem('tokens')
    localStorage.removeItem('user')
    localStorage.removeItem('is_following')
  }

  async function requestRecords() {
    return {
      ok: true,
      tokens: JSON.parse(localStorage.getItem('tokens')),
      user: JSON.parse(localStorage.getItem('user')),
      isFollowing: localStorage.getItem('is_following') === 'true',
    }
  }
  async function requestTokens({ codeChallenge, code }) {
    const response = await handler.requestTokens({
      codeChallenge,
      code,
    })

    if (response.unauthorized) {
      _clear()
    } else if (response.ok) {
      localStorage.setItem(
        'tokens',
        JSON.stringify(response.tokens),
      )
    }

    return response
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

  async function requestAuthorizationEffect() {
    const savedState = localStorage.getItem('state')
    const codeChallenge = localStorage.getItem('code_challenge')

    const response = await handler.requestAuthorizationEffect()

    return {
      ...response,
      savedState,
      codeChallenge,
    }
  }

  async function requestAuthorizationEffectRemoval() {
    localStorage.removeItem('state')
    localStorage.removeItem('code_challenge')

    const response = await handler.requestAuthorizationEffectRemoval()

    return response
  }

  async function requestDeauthorization({ tokens }) {
    setTimeout(_clear, 0)

    const response = await handler.requestDeauthorization({ tokens })

    return response
  }

  async function requestUser({ tokens }) {
    const response = await handler.requestUser({ tokens })

    if (response.unauthorized) {
      _clear()
    } else if (response.ok) {
      localStorage.setItem(
        'user',
        JSON.stringify(response.user),
      )
    }

    return response
  }

  async function requestFollowingOfNasa({ tokens, user }) {
    const response = await handler.requestFollowingOfNasa({
      tokens,
      user,
    })

    if (response.unauthorized) {
      _clear()
    } else if (response.ok) {
      localStorage.setItem(
        'is_following',
        true,
      )
    }

    return response
  }

  async function requestUnfollowingOfNasa({ tokens, user }) {
    const response = await handler.requestUnfollowingOfNasa({
      tokens,
      user,
    })

    if (response.unauthorized) {
      _clear()
    } else if (response.ok) {
      localStorage.setItem(
        'is_following',
        false,
      )
    }

    return response
  }

  return {
    ...handler,
    requestRecords,
    requestTokens,
    requestAuthorization,
    requestAuthorizationEffect,
    requestAuthorizationEffectRemoval,
    requestDeauthorization,
    requestUser,
    requestFollowingOfNasa,
    requestUnfollowingOfNasa,
  }
}
