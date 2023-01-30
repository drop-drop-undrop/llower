export default function Collection(handler = {}) {
  const _works = ValueNotifier({})
  const _isLoading = _works.map((newWorks) => {
    if (Object.keys(newWorks).length === 0) {
      return false
    } else {
      return Object.values(newWorks)
        .reduce((prev, current) => prev || current)
    }
  })

  const _tokens = ValueNotifier()
  const _user = ValueNotifier()
  const _isFollowing = ValueNotifier()
  const _clear = () => {
    _tokens.value = null
    _user.value = null
    _isFollowing.value = null
  }

  async function requestDump() {
    _works.value = {
      ..._works.value,
      requestingDump: true,
    }

    const response = await handler.requestDump()

    response.ifOk(({ tokens, user, isFollowing }) => {
      _tokens.value = tokens
      _user.value = user
      _isFollowing.value = isFollowing
    })

    _works.value = {
      ..._works.value,
      requestingDump: false,
    }
  }

  setTimeout(requestDump, 0)

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

  async function requestTokens() {
    _works.value = {
      ..._works.value,
      requestingTokens: true,
    }

    const response = await handler.requestTokens()

    response.ifUnauthorized(_clear)
    response.ifOk((newTokens) => { _tokens.value = newTokens })

    _works.value = {
      ..._works.value,
      requestingTokens: false,
    }
  }

  setTimeout(async () => {
    await requestTokens()
    if (_tokens.value && !_user.value) {
      await requestUser()
    }
  }, 0)

  async function requestRevocationOfTokens() {
    setTimeout(_clear, 0)

    await handler.requestRevocationOfTokens({
      tokens: _tokens.value,
    })
  }

  async function requestUser() {
    _works.value = {
      ..._works.value,
      requestingUser: true,
    }

    const response = await handler.requestUser({
      tokens: _tokens.value,
    })

    response.ifUnauthorized(_clear)
    response.ifOk((newUser) => { _user.value = newUser })

    _works.value = {
      ..._works.value,
      requestingUser: false,
    }
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

    response.ifUnauthorized(_clear)
    response.ifOk(() => { _isFollowing.value = true })

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

    response.ifUnauthorized(_clear)
    response.ifOk(() => { _isFollowing.value = false })

    _works.value = {
      ..._works.value,
      requestingUnfollowingOfNasa: false,
    }
  }

  return {
    ...handler,
    requestAuthorization,
    requestTokens,
    requestRevocationOfTokens,
    requestUser,
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
