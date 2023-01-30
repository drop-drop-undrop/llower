export default function Guard(handler = {}) {
  async function requestTokens({
    savedState,
    codeChallenge,
    givenState,
    code,
  }) {
    if (!savedState || !codeChallenge || !givenState || !code) {
      return {
        ifUnauthorized: (handle) => { },
        ifOk: (handle) => { },
        ifNotOk: (handle) => { },
      }
    } else if (savedState !== givenState) {
      return {
        ifUnauthorized: (handle) => { },
        ifOk: (handle) => { },
        ifNotOk: (handle) => {
          handle('authorization state is mismatched')
        },
      }
    } else {
      const response = await handler.requestTokens({
        savedState,
        codeChallenge,
        givenState,
        code,
      })

      return response
    }
  }

  return {
    ...handler,
    requestTokens,
  }
}
