import { createContext, useContext } from 'react'

export function Twitter({ children }) {
  return (
    <context.Provider value={twitter}>
      {children}
    </context.Provider>
  )
}

export function useTwitter() {
  return useContext(context)
}

const context = createContext({
  requestAuthorization: () => { },
  requestFollowingOfNasa: () => { },
  requestUnfollowingOfNasa: () => { },
  requestDeauthorization: (receiver) => { },
  subscribeToLoading: (receiver) => { },
  unsubscribeFromLoading: (receiver) => { },
  subscribeToTokens: (receiver) => { },
  unsubscribeFromTokens: (receiver) => { },
  subscribeToUser: (receiver) => { },
  unsubscribeFromUser: (receiver) => { },
  subscribeToFollowing: (receiver) => { },
  unsubscribeFromFollowing: (receiver) => { },
})

const twitter = (() => {
  const tokens = _Subject(() => {
    const encodedTokens = localStorage.getItem('tokens')
    const decodedTokens = JSON.parse(encodedTokens)
    return decodedTokens
  }, (oldTokens, newTokens) => (
    oldTokens?.access_token !== newTokens?.access_token
    || oldTokens?.refresh_token !== newTokens?.refresh_token
  ), (newTokens) => {
    if (newTokens) {
      const encodedToken = JSON.stringify(newTokens)
      localStorage.setItem('tokens', encodedToken)
    }
  }, (newTokens) => {
    if (!newTokens) localStorage.removeItem('tokens')
  })

  const user = _Subject(() => {
    const encodedUser = localStorage.getItem('user')
    const decodedUser = JSON.parse(encodedUser)
    return decodedUser
  }, (oldUser, newUser) => (
    oldUser?.id !== newUser?.id
    || oldUser?.username !== newUser?.username
  ), (newUser) => {
    if (newUser) {
      const encodedUser = JSON.stringify(newUser)
      localStorage.setItem('user', encodedUser)
    }
  }, (newUser) => {
    if (!newUser) localStorage.removeItem('user')
  })

  const loadings = _Subject(() => ({}))
  const loading = _Subject(() => true)

  loadings.subscribe((newLoadings) => {
    if (Object.keys(newLoadings).length !== 0) {
      const newLoading = Object.values(newLoadings)
        .reduce((prev, current) => prev || current)
      loading.change(newLoading)
    }
  })

  tokens.subscribe(async (newTokens) => {
    if (newTokens) {
      try {
        loadings.change({
          ...loadings.value(),
          requestingUserLookup: true,
        })

        const endpoint = [
          'https://drop-drop-undrop.netlify.app/',
          '.netlify/functions/llower_proxy/',
          'https://api.twitter.com/2/users/me',
        ].join('')
        const authorization = `Bearer ${newTokens.access_token}`
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { authorization },
        })

        if (response.status === 200) {
          const { data } = await response.json()
          user.change(data)
        } else if (response.status === 401) {
          tokens.change(null)
        } else {
          throw Error(await response.text())
        }
      } catch (error) {
        console.log(error)
      } finally {
        loadings.change({
          ...loadings.value(),
          requestingUserLookup: false,
        })
      }
    }
  }, (newTokens) => {
    if (!newTokens) user.change(null)
  })

  const following = _Subject(() => (
    localStorage.getItem('following')
  ), (oldFollowing, newFollowing) => (
    oldFollowing !== newFollowing
  ), (newFollowing) => {
    if (newFollowing) localStorage.setItem('following', newFollowing)
  }, (newFollowing) => {
    if (!newFollowing) localStorage.removeItem('following')
  })

  user.subscribe((newUser) => {
    if (!newUser) following.change(null)
  })

  async function tryRespondingToAuthorization() {
    try {
      loadings.change({
        ...loadings.value(),
        respondingToAuthorization: true,
      })

      const url = new URL(window.location.href)
      const passedInError = url.searchParams.get('error')
      url.searchParams.delete('error')
      const passedInCode = url.searchParams.get('code')
      url.searchParams.delete('code')
      const passedInState = url.searchParams.get('state')
      url.searchParams.delete('state')
      const state = localStorage.getItem('state')
      localStorage.removeItem('state')
      const codeChallenge = localStorage.getItem('code_challenge')
      localStorage.removeItem('code_challenge')

      if (passedInError && passedInState === state && codeChallenge) {
        window.history.replaceState({}, document.title, url)
      } else if (passedInCode && passedInState === state && codeChallenge) {
        window.history.replaceState({}, document.title, url)

        // twitter still has no support for CORS 😞
        // people has been requesting it since 2014
        const endpoint = [
          'https://drop-drop-undrop.netlify.app/',
          '.netlify/functions/llower_proxy/',
          'https://api.twitter.com/2/oauth2/token',
        ].join('')
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: Object.entries({
            client_id: 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ',
            redirect_uri: 'https://drop-drop-undrop.github.io',
            grant_type: 'authorization_code',
            code: passedInCode,
            code_verifier: codeChallenge,
          }).map(([key, value]) => {
            const encodedKey = encodeURIComponent(key)
            const encodedValue = encodeURIComponent(value)
            return `${encodedKey}=${encodedValue}`
          }).join('&'),
        })

        if (response.status === 200) {
          tokens.change(await response.json())
        } else if (response.status === 401) {
          tokens.change(null)
        } else {
          throw Error(await response.text())
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      loadings.change({
        ...loadings.value(),
        respondingToAuthorization: false,
      })
    }
  }

  if (!tokens.value()) tryRespondingToAuthorization()

  function requestAuthorization() {
    try {
      loadings.change({
        ...loadings.value(),
        requestingAuthorization: true,
      })

      const url = new URL('https://twitter.com/i/oauth2/authorize')
      const clientId = 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ'
      url.searchParams.set('client_id', clientId)
      const redirectUri = 'https://drop-drop-undrop.github.io'
      url.searchParams.set('redirect_uri', redirectUri)
      const responseType = 'code'
      url.searchParams.set('response_type', responseType)
      const scope = [
        'users.read',
        'tweet.read',
        'follows.read',
        'follows.write',
        'offline.access',
      ].join(' ')
      url.searchParams.set('scope', scope)
      const codeChallengeMethod = 'plain'
      url.searchParams.set(
        'code_challenge_method',
        codeChallengeMethod,
      )

      const randoms = new Uint32Array(2)
      crypto.getRandomValues(randoms)
      const [codeChallenge, state] = randoms
      url.searchParams.set('code_challenge', codeChallenge)
      localStorage.setItem('code_challenge', codeChallenge)
      url.searchParams.set('state', state)
      localStorage.setItem('state', state)

      window.location.assign(url)
    } catch (error) {
      console.log(error)
    } finally {
      loadings.change({
        ...loadings.value(),
        requestingAuthorization: false,
      })
    }
  }

  async function requestFollowingOfNasa() {
    try {
      loadings.change({
        ...loadings.value(),
        requestingFollowingOfNasa: true,
      })

      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/users/',
        `${user.value().id}/following`,
      ].join('')
      const authorization = `Bearer ${tokens.value().access_token}`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization,
        },
        body: JSON.stringify({
          target_user_id: NASA_ID,
        }),
      })

      if (response.status === 200) {
        const { data } = await response.json()
        following.change(data.following)
      } else if (response.status === 401) {
        tokens.change(null)
      } else {
        throw Error(await response.text())
      }
    } catch (error) {
      console.log(error)
    } finally {
      loadings.change({
        ...loadings.value(),
        requestingFollowingOfNasa: false,
      })
    }
  }

  async function requestUnfollowingOfNasa() {
    try {
      loadings.change({
        ...loadings.value(),
        requestingUnfollowingOfNasa: true,
      })

      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/users/',
        `${user.value().id}/following/${NASA_ID}`,
      ].join('')
      const authorization = `Bearer ${tokens.value().access_token}`
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { authorization },
      })

      if (response.status === 200) {
        const { data } = await response.json()
        following.change(data.following)
      } else if (response.status === 401) {
        tokens.change(null)
      } else {
        throw Error(await response.text())
      }
    } catch (error) {
      console.log(error)
    } finally {
      loadings.change({
        ...loadings.value(),
        requestingUnfollowingOfNasa: false,
      })
    }
  }

  async function requestDeauthorization() {
    try {
      const oldTokens = tokens.value()
      tokens.change(null)

      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/oauth2/revoke',
      ].join('')

      const response1 = fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: Object.entries({
          client_id: 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ',
          token_type_hint: 'access_token',
          token: oldTokens.access_token,
        }).map(([key, value]) => {
          const encodedKey = encodeURIComponent(key)
          const encodedValue = encodeURIComponent(value)
          return `${encodedKey}=${encodedValue}`
        }).join('&'),
      })
      const response2 = fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: Object.entries({
          client_id: 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ',
          token_type_hint: 'refresh_token',
          token: oldTokens.refresh_token,
        }).map(([key, value]) => {
          const encodedKey = encodeURIComponent(key)
          const encodedValue = encodeURIComponent(value)
          return `${encodedKey}=${encodedValue}`
        }).join('&'),
      })

      await Promise.all([response1, response2])
        .then((it) => it.filter((response) => (
          response.status !== 200
        )))
        .then((it) => it.forEach(async (response) => {
          throw Error(await response.text())
        }))
    } catch (error) {
      console.log(error)
    }
  }

  return {
    requestAuthorization,
    requestFollowingOfNasa,
    requestUnfollowingOfNasa,
    requestDeauthorization,
    subscribeToLoading: loading.subscribe,
    unsubscribeFromLoading: loading.unsubscribe,
    subscribeToTokens: tokens.subscribe,
    unsubscribeFromTokens: tokens.unsubscribe,
    subscribeToUser: user.subscribe,
    unsubscribeFromUser: user.unsubscribe,
    subscribeToFollowing: following.subscribe,
    unsubscribeFromFollowing: following.unsubscribe,
  }
})()

function _Subject(
  initValue,
  changed = (oldValue, newValue) => oldValue !== newValue,
  ...initReceivers
) {
  let value = initValue()
  const receivers = new Set(initReceivers)

  return {
    value: () => value,
    change: (newValue) => {
      if (changed(value, newValue)) {
        value = newValue
        for (const send of receivers) {
          send(value)
        }
      }
    },
    subscribe: (...newReceivers) => {
      for (const receiver of newReceivers) {
        receiver(value)
        receivers.add(receiver)
      }
    },
    unsubscribe: (oldReceiver) => {
      receivers.delete(oldReceiver)
    },
  }
}

const NASA_ID = '11348282'
