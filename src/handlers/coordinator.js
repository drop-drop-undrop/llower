export default function Coordinator(handler = {}) {
  const _tokens = ValueNotifier()
  const _user = ValueNotifier()
  const _isFollowing = ValueNotifier()
  const _works = ValueNotifier({})
  const _isLoading = _works.map((newWorks) => {
    if (Object.keys(newWorks).length === 0) {
      return false
    } else {
      const compare = (a, b) => a || b
      const values = Object.values(newWorks)
      return values.reduce(compare)
    }
  })

  async function _clear() {
    _tokens.value = null
    _user.value = null
    _isFollowing.value = null
  }

  async function _recover() {
    _works.value = {
      ..._works.value,
      recovering: true,
    }

    const recordsResponse = await handler.requestRecords()
    if (recordsResponse.ok) {
      _tokens.value = recordsResponse.tokens
      _user.value = recordsResponse.user
      _isFollowing.value = recordsResponse.isFollowing
    }

    const effectResponse = await handler.requestAuthorizationEffect()
    await handler.requestAuthorizationEffectRemoval()
    if (
      effectResponse.ok
      && effectResponse.savedState
      && effectResponse.codeChallenge
      && effectResponse.givenState
      && effectResponse.code
      && effectResponse.savedState === effectResponse.givenState
    ) {
      const tokensResponse = await handler.requestTokens({
        codeChallenge: effectResponse.codeChallenge,
        code: effectResponse.code,
      })
      if (tokensResponse.unauthorized) {
        _clear()
      } else if (tokensResponse.ok) {
        _tokens.value = tokensResponse.tokens

        const userResponse = await handler.requestUser({
          tokens: _tokens.value,
        })
        if (userResponse.unauthorized) {
          _clear()
        } else if (userResponse.ok) {
          _user.value = userResponse.user
        }
      }
    }

    _works.value = {
      ..._works.value,
      recovering: false,
    }
  }

  setTimeout(_recover, 0)

  async function requestAuthorization() {
    _works.value = {
      ..._works.value,
      requestingAuthorization: true,
    }

    await handler.requestAuthorization()

    _works.value = {
      ..._works.value,
      requestingAuthorization: false,
    }
  }

  async function requestDeauthorization() {
    setTimeout(_clear, 0)

    await handler.requestDeauthorization({
      tokens: _tokens.value,
    })
  }

  async function requestFollowingOfNasa() {
    _works.value = {
      ..._works.value,
      requestingFollowingOfNasa: true,
    }

    const response = await handler.requestFollowingOfNasa({
      tokens: _tokens.value,
      user: _user.value,
    })

    if (response.unauthorized) {
      _clear()
    } else if (response.ok) {
      _isFollowing.value = true
    }

    _works.value = {
      ..._works.value,
      requestingFollowingOfNasa: false,
    }
  }

  async function requestUnfollowingOfNasa() {
    _works.value = {
      ..._works.value,
      requestingUnfollowingOfNasa: true,
    }

    const response = await handler.requestUnfollowingOfNasa({
      tokens: _tokens.value,
      user: _user.value,
    })

    if (response.unauthorized) {
      _clear()
    } else if (response.ok) {
      _isFollowing.value = false
    }

    _works.value = {
      ..._works.value,
      requestingUnfollowingOfNasa: false,
    }
  }

  return {
    ...handler,
    requestAuthorization,
    requestDeauthorization,
    requestFollowingOfNasa,
    requestUnfollowingOfNasa,
    subscribeToIsLoading: _isLoading.subscribe,
    unsubscribeFromIsLoading: _isLoading.unsubscribe,
    subscribeToTokens: _tokens.subscribe,
    unsubscribeFromTokens: _tokens.unsubscribe,
    subscribeToUser: _user.subscribe,
    unsubscribeFromUser: _user.unsubscribe,
    subscribeToIsFollowing: _isFollowing.subscribe,
    unsubscribeFromIsFollowing: _isFollowing.unsubscribe,
  }
}

function ValueNotifier(
  defaultValue = null,
  defaultReceivers = [],
) {
  let value = defaultValue

  const receivers = new Set(defaultReceivers)
  const broadcast = (newValue) => {
    receivers.forEach((receiver) => {
      receiver(newValue)
    })
  }

  return {
    get value() {
      return value
    },
    set value(newValue) {
      if (value !== newValue) {
        value = newValue
        broadcast(value)
      }
    },
    subscribe: (newReceiver) => {
      newReceiver(value)
      receivers.add(newReceiver)
    },
    unsubscribe: (receiver) => {
      receivers.delete(receiver)
    },
    map: (transform) => {
      const newNotifier = ValueNotifier()
      const newReceiver = (newValue) => {
        newNotifier.value = transform(newValue)
      }

      newReceiver(value)
      receivers.add(newReceiver)

      return newNotifier
    },
  }
}
