import { useEffect, useState } from 'react'
import { useAppData } from './app_data'

function Loading({ children }) {
  const appData = useAppData()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appData.subscribeToIsLoading(setLoading)
    return () => {
      appData.unsubscribeFromIsLoading(setLoading)
    }
  }, [appData])

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          margin: 'auto',
          background: '#f1f2f3',
          display: 'block',
          zIndex: '1',
          position: 'absolute',
          transitionDelay: '0.15s',
          transition: 'visibility 0.7s, opacity 0.7s ease-in-out',
          ...(loading
            ? { visibility: 'visible', opacity: 1 }
            : { visibility: 'hidden', opacity: 0 }),
        }}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid"
      // viewBox="0 0 1084 322"
      >
        <defs>
          <pattern id="pid-0.09336838170898965" x="0" y="0" width="140.8" height="140.8" patternUnits="userSpaceOnUse">
            <g transform="scale(0.55)">
              <path d="M -256 12.240000000000002 C -192 12.240000000000002 -192 2 -128 2 C -64 2 -64 12.240000000000002 2 12.240000000000002 C 64 12.240000000000002 64 2 128 2 C 192 2 192 12.240000000000002 256 12.240000000000002 L 384 384 L -384 384 L -384 12.240000000000002 Z" fill="#1d5167" stroke="#1d5167" strokeWidth="1" transform="translate(0 -51.2)">
                <animateTransform attributeName="transform" type="translate" values="256 -51.2;0 -51.2;256 -51.2" keyTimes="0;0.5;1" dur="6.666666666666666s" repeatCount="indefinite" calcMode="spline" begin="0s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" />
              </path>
              <path d="M -256 12.240000000000002 C -192 12.240000000000002 -192 2 -128 2 C -64 2 -64 12.240000000000002 2 12.240000000000002 C 64 12.240000000000002 64 2 128 2 C 192 2 192 12.240000000000002 256 12.240000000000002 L 384 384 L -384 384 L -384 12.240000000000002 Z" fill="#437f79" stroke="#437f79" strokeWidth="1" transform="translate(0 0)">
                <animateTransform attributeName="transform" type="translate" values="0 0;256 0;0 0" keyTimes="0;0.5;1" dur="6.666666666666666s" repeatCount="indefinite" calcMode="spline" begin="-0.6666666666666665s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" />
              </path>
              <path d="M -256 12.240000000000002 C -192 12.240000000000002 -192 2 -128 2 C -64 2 -64 12.240000000000002 2 12.240000000000002 C 64 12.240000000000002 64 2 128 2 C 192 2 192 12.240000000000002 256 12.240000000000002 L 384 384 L -384 384 L -384 12.240000000000002 Z" fill="#7aab92" stroke="#7aab92" strokeWidth="1" transform="translate(0 51.2)">
                <animateTransform attributeName="transform" type="translate" values="256 51.2;0 51.2;256 51.2" keyTimes="0;0.5;1" dur="6.666666666666666s" repeatCount="indefinite" calcMode="spline" begin="-1.333333333333333s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" />
              </path>
              <path d="M -256 12.240000000000002 C -192 12.240000000000002 -192 2 -128 2 C -64 2 -64 12.240000000000002 2 12.240000000000002 C 64 12.240000000000002 64 2 128 2 C 192 2 192 12.240000000000002 256 12.240000000000002 L 384 384 L -384 384 L -384 12.240000000000002 Z" fill="#b0c7a2" stroke="#b0c7a2" strokeWidth="1" transform="translate(0 102.4)">
                <animateTransform attributeName="transform" type="translate" values="0 102.4;256 102.4;0 102.4" keyTimes="0;0.5;1" dur="6.666666666666666s" repeatCount="indefinite" calcMode="spline" begin="-1.9999999999999998s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" />
              </path>
              <path d="M -256 12.240000000000002 C -192 12.240000000000002 -192 2 -128 2 C -64 2 -64 12.240000000000002 2 12.240000000000002 C 64 12.240000000000002 64 2 128 2 C 192 2 192 12.240000000000002 256 12.240000000000002 L 384 384 L -384 384 L -384 12.240000000000002 Z" fill="#e8f2d1" stroke="#e8f2d1" strokeWidth="1" transform="translate(0 153.6)">
                <animateTransform attributeName="transform" type="translate" values="256 153.6;0 153.6;256 153.6" keyTimes="0;0.5;1" dur="6.666666666666666s" repeatCount="indefinite" calcMode="spline" begin="-2.666666666666666s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" />
              </path>
              <path d="M -256 12.240000000000002 C -192 12.240000000000002 -192 2 -128 2 C -64 2 -64 12.240000000000002 2 12.240000000000002 C 64 12.240000000000002 64 2 128 2 C 192 2 192 12.240000000000002 256 12.240000000000002 L 384 384 L -384 384 L -384 12.240000000000002 Z" fill="#1d5167" stroke="#1d5167" strokeWidth="1" transform="translate(0 204.8)">
                <animateTransform attributeName="transform" type="translate" values="0 204.8;256 204.8;0 204.8" keyTimes="0;0.5;1" dur="6.666666666666666s" repeatCount="indefinite" calcMode="spline" begin="0s" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" />
              </path>
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pid-0.09336838170898965)" />
      </svg>
      {children}
    </>
  )
}

export default Loading
