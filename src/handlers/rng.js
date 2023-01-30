export default function RNG(handler = {}) {
  async function requestAuthorization() {
    const randoms = new Uint32Array(2)
    crypto.getRandomValues(randoms)
    const [codeChallenge, state] = randoms

    await handler.requestAuthorization({
      codeChallenge,
      state,
    })
  }

  return {
    ...handler,
    requestAuthorization,
  }
}
