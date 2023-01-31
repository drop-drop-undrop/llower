import {
  createContext,
  useContext,
} from 'react'

export function AppData({
  handler,
  children,
}) {
  return (
    <context.Provider value={handler}>
      {children}
    </context.Provider>
  )
}

export function useAppData() {
  return useContext(context)
}

const context = createContext({
  requestAuthorization: () => { },
  requestDeauthorization: () => { },
  requestUser: () => { },
  requestFollowingOfNasa: () => { },
  requestUnfollowingOfNasa: () => { },
  subscribeToIsLoading: (receiver) => { },
  unsubscribeFromIsLoading: (receiver) => { },
  subscribeToTokens: (receiver) => { },
  unsubscribeFromTokens: (receiver) => { },
  subscribeToUser: (receiver) => { },
  unsubscribeFromUser: (receiver) => { },
  subscribeToIsFollowing: (receiver) => { },
  unsubscribeFromIsFollowing: (receiver) => { },
})
