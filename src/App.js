import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Loading from './Loading'
import { Twitter, useTwitter } from './Twitter'

export default function App() {
  return (
    <Twitter>
      <Loading>
        <Title />
        <Description />
      </Loading>
    </Twitter>
  )
}

function Title() {
  return (
    <Heading style={{
      borderWidth: 2,
      borderColor: 'black',
      borderStyle: 'solid',
      borderRadius: '9px',
      boxShadow: '0.5px 3px 1px',
    }}
    >
      <div style={{
        borderWidth: 2,
        borderColor: 'black',
        borderStyle: 'solid',
        borderRadius: '9px',
        padding: 7,
      }}
      >
        llower.
      </div>
    </Heading>
  )
}

const Heading = styled.div(({ z }) => ({
  display: 'inline-block',
  position: 'absolute',
  left: 19,
  top: 19,
  fontSize: '2em',
  fontWeight: 'bolder',
  padding: 9,
  margin: 0,
  zIndex: z || 'auto',
  textAlign: 'center',
}))

function Description() {
  const twitter = useTwitter()
  const [status, setStatus] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    twitter.subscribeToTokens(setStatus)
    twitter.subscribeToUser(setUser)
    return () => {
      twitter.unsubscribeFromUser(setUser)
      twitter.unsubscribeFromTokens(setStatus)
    }
  }, [twitter])

  if (!status) {
    return (
      <Center>
        <Column>
          <div style={{
            fontSize: '4em',
            fontWeight: 'bold',
            position: 'relative',
            left: -29,
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: '9px',
            boxShadow: '0.5px 3px 1px',
            padding: 9,
          }}
          >
            <div style={{
              borderWidth: 2,
              borderColor: 'black',
              borderStyle: 'solid',
              borderRadius: '9px',
              boxShadow: '0.5px 3px 1px',
              padding: 9,
            }}
            >
              <div style={{
                borderWidth: 2,
                borderColor: 'black',
                borderStyle: 'solid',
                borderRadius: '9px',
                padding: 9,
              }}
              >
                Hello.
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            You are not
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            logged in yet,
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            you can &nbsp;
            <LoginButton />
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            with Twitter 🐦;
          </div>
        </Column>
      </Center>
    )
  } else {
    return (
      <Center>
        <Column>
          <div style={{
            fontSize: '4em',
            fontWeight: 'bold',
            position: 'relative',
            left: -29,
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: '9px',
            boxShadow: '0.5px 3px 1px',
            padding: 9,
          }}
          >
            <div style={{
              borderWidth: 2,
              borderColor: 'black',
              borderStyle: 'solid',
              borderRadius: '9px',
              boxShadow: '0.5px 3px 1px',
              padding: 9,
            }}
            >
              <div style={{
                borderWidth: 2,
                borderColor: 'black',
                borderStyle: 'solid',
                borderRadius: '9px',
                padding: 9,
              }}
              >
                Hi.
              </div>
            </div>
          </div>
          {user && (
            <div style={{
              fontSize: '2em',
              fontWeight: 'bold',
              position: 'relative',
              left: -33,
            }}
            >
              <a
                href={`https://twitter.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @
                {user.username}
              </a>
            </div>
          )}
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            You are now
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            logged in 👏,
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            you can &nbsp;
            <FollowButton />
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            🧑‍🚀 &nbsp;
            <a
              href="https://twitter.com/nasa"
              target="_blank"
              rel="noopener noreferrer"
            >
              @NASA
            </a>
          </div>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
          }}
          >
            or &nbsp;
            <LogoutButton />
            &nbsp; ;
          </div>
        </Column>
      </Center>
    )
  }
}

const Center = styled.div({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Column = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

function LoginButton({ style }) {
  const twitter = useTwitter()

  return (
    <Button
      type="button"
      onClick={twitter.requestAuthorization}
      style={style || {
        fontSize: '0.9em',
        fontWeight: 'bold',
      }}
    >
      log in
    </Button>
  )
}

function FollowButton({ style }) {
  const twitter = useTwitter()
  const [following, setFollowing] = useState(null)

  useEffect(() => {
    twitter.subscribeToFollowing(setFollowing)
    return () => {
      twitter.unsubscribeFromFollowing(setFollowing)
    }
  }, [twitter])

  if (!following) {
    return (
      <Button
        type="button"
        onClick={twitter.requestFollowingOfNasa}
        style={style || {
          fontSize: '0.9em',
          fontWeight: 'bold',
        }}
      >
        follow
      </Button>
    )
  } else {
    return (
      <Button
        type="button"
        onClick={twitter.requestUnfollowingOfNasa}
        style={style || {
          fontSize: '0.9em',
          fontWeight: 'bold',
        }}
      >
        unfollow
      </Button>
    )
  }
}

function LogoutButton({ style }) {
  const twitter = useTwitter()

  return (
    <Button
      type="button"
      onClick={twitter.requestDeauthorization}
      style={style || {
        fontSize: '0.9em',
        fontWeight: 'bold',
      }}
    >
      log out
    </Button>
  )
}

const Button = styled.button({
  alignItems: 'center',
  appearance: 'none',
  backgroundColor: '#FCFCFD',
  borderRadius: '4px',
  boxShadow: [
    'rgba(45, 35, 66, 0.4) 0 2px 4px',
    'rgba(45, 35, 66, 0.3) 0 7px 13px -3px',
    '#D6D6E7 0 -3px 0 inset',
  ].join(),
  boxSizing: 'border-box',
  color: '#36395A',
  cursor: 'pointer',
  fontFamily: 'monospace',
  justifyContent: 'center',
  listStyle: 'none',
  paddingLeft: 11,
  paddingRight: 11,
  paddingBottom: 4,
  textDecoration: 'none',
  userSelect: 'none',
  touchAction: 'manipulation',
  willChange: [
    'box-shadow',
    'transform',
  ].join(),
  transition: [
    'box-shadow .15s',
    'transform .15s',
  ].join(),
  '&:hover': {
    boxShadow: [
      'rgba(45, 35, 66, 0.4) 0 4px 8px',
      'rgba(45, 35, 66, 0.3) 0 7px 13px -3px',
      '#D6D6E7 0 -3px 0 inset',
    ].join(),
    transform: 'translateY(-2px)',
  },
  '&:active': {
    boxShadow: '#D6D6E7 0 3px 7px inset',
    transform: 'translateY(2px)',
  },
})
