export default function Twitter() {
  async function requestTokens({
    codeChallenge = '',
    code = '',
  }) {
    try {
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
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
          grant_type: 'authorization_code',
          code_verifier: codeChallenge,
          code,
        }).map(([key, value]) => {
          const encodedKey = encodeURIComponent(key)
          const encodedValue = encodeURIComponent(value)
          return `${encodedKey}=${encodedValue}`
        }).join('&'),
      })

      if (response.status === 401) {
        const text = await response.text()

        return {
          ifUnauthorized: async (handle) => {
            handle(text)
          },
          ifOk: (handle) => { },
          ifNotOk: (handle) => { },
        }
      } else if (response.status === 200) {
        const tokens = await response.json()

        return {
          ifUnauthorized: (handle) => { },
          ifOk: async (handle) => {
            handle(tokens)
          },
          ifNotOk: (handle) => { },
        }
      } else {
        const text = await response.text()

        return {
          ifUnauthorized: (handle) => { },
          ifOk: (handle) => { },
          ifNotOk: async (handle) => {
            handle(text)
          },
        }
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

  async function requestRevocationOfTokens({ tokens = {} }) {
    try {
      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/oauth2/revoke',
      ].join('')

      const responses = await Promise.all([
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: Object.entries({
            client_id: 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ',
            token_type_hint: 'access_token',
            token: tokens.access_token,
          }).map(([key, value]) => {
            const encodedKey = encodeURIComponent(key)
            const encodedValue = encodeURIComponent(value)
            return `${encodedKey}=${encodedValue}`
          }).join('&'),
        }),
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: Object.entries({
            client_id: 'QlMyWExoOGtPZmtJSkhISDBuSDk6MTpjaQ',
            token_type_hint: 'refresh_token',
            token: tokens.refresh_token,
          }).map(([key, value]) => {
            const encodedKey = encodeURIComponent(key)
            const encodedValue = encodeURIComponent(value)
            return `${encodedKey}=${encodedValue}`
          }).join('&'),
        }),
      ])

      const response = responses.find(({ status }) => status !== 200)

      if (!response) {
        return {
          ifUnauthorized: (handle) => { },
          ifOk: async (handle) => {
            handle()
          },
          ifNotOk: (handle) => { },
        }
      } else {
        const text = await response.text()

        return {
          ifUnauthorized: (handle) => { },
          ifOk: (handle) => { },
          ifNotOk: async (handle) => {
            handle(text)
          },
        }
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

  async function requestUser({ tokens = {} }) {
    try {
      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/users/me',
      ].join('')
      const authorization = `Bearer ${tokens.access_token}`
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { authorization },
      })

      if (response.status === 401) {
        const text = await response.text()

        return {
          ifUnauthorized: async (handle) => {
            handle(text)
          },
          ifOk: (handle) => { },
          ifNotOk: (handle) => { },
        }
      } else if (response.status === 200) {
        const user = (await response.json()).data

        return {
          ifUnauthorized: (handle) => { },
          ifOk: async (handle) => {
            handle(user)
          },
          ifNotOk: (handle) => { },
        }
      } else {
        const text = await response.text()

        return {
          ifUnauthorized: (handle) => { },
          ifOk: (handle) => { },
          ifNotOk: async (handle) => {
            handle(text)
          },
        }
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

  async function requestFollowingOfNasa({
    tokens = {},
    user = {},
  }) {
    try {
      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/users/',
        `${user.id}/following`,
      ].join('')
      const authorization = `Bearer ${tokens.access_token}`
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

      if (response.status === 401) {
        const text = await response.text()

        return {
          ifUnauthorized: async (handle) => {
            handle(text)
          },
          ifOk: (handle) => { },
          ifNotOk: (handle) => { },
        }
      } else if (response.status === 200) {
        const isFollowing = (await response.json()).following

        return {
          ifUnauthorized: (handle) => { },
          ifOk: async (handle) => {
            handle(isFollowing)
          },
          ifNotOk: (handle) => { },
        }
      } else {
        const text = await response.text()

        return {
          ifUnauthorized: (handle) => { },
          ifOk: (handle) => { },
          ifNotOk: async (handle) => {
            handle(text)
          },
        }
      }
    } catch (error) {
      return {
        ifUnauthorized: (handle) => { },
        ifOk: (handle) => { },
        ifNotOk: async (handle) => {
          handle(error.message)
        },
      }
    }
  }

  async function requestUnfollowingOfNasa({
    tokens = {},
    user = {},
  }) {
    try {
      const endpoint = [
        'https://drop-drop-undrop.netlify.app/',
        '.netlify/functions/llower_proxy/',
        'https://api.twitter.com/2/users/',
        `${user.id}/following/${NASA_ID}`,
      ].join('')
      const authorization = `Bearer ${tokens.access_token}`
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { authorization },
      })

      if (response.status === 401) {
        const text = await response.text()

        return {
          ifUnauthorized: async (handle) => {
            handle(text)
          },
          ifOk: (handle) => { },
          ifNotOk: (handle) => { },
        }
      } else if (response.status === 200) {
        const isFollowing = (await response.json()).following

        return {
          ifUnauthorized: (handle) => { },
          ifOk: async (handle) => {
            handle(isFollowing)
          },
          ifNotOk: (handle) => { },
        }
      } else {
        const text = await response.text()

        return {
          ifUnauthorized: (handle) => { },
          ifOk: (handle) => { },
          ifNotOk: async (handle) => {
            handle(text)
          },
        }
      }
    } catch (error) {
      return {
        ifUnauthorized: (handle) => { },
        ifOk: (handle) => { },
        ifNotOk: async (handle) => {
          handle(await error.message)
        },
      }
    }
  }

  return {
    requestTokens,
    requestRevocationOfTokens,
    requestUser,
    requestFollowingOfNasa,
    requestUnfollowingOfNasa,
  }
}

const NASA_ID = '11348282'
