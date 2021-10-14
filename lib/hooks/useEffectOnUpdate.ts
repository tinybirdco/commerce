import { useRef, useEffect } from 'react'

// The effect is only called in updates of the dependencies, not with the initial values.
// The first call to the hook, with the initial values of the dependencies, does nothing.
// Then the effect is only called in following changes on the value of the dependencies.
export default function useEffectOnUpdate(callback: Function, dependencies: Array) {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      callback(dependencies)
    } else {
      didMount.current = true
    }
  }, dependencies)
}

