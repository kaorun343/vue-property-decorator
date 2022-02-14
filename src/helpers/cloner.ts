function cloneArray(array: any[]) {
  const result = [ ...array ]

  result.forEach((sub: any, index: number) => {
    result[index] = clone(sub)
  })

  return result
}

function cloneObject(obj: any) {
  const result = { ...obj }

  Object.keys(result).forEach((key: string) => {
    result[key] = clone(result[key])
  })

  return result
}

export function clone<T extends any>(obj: T) {
  if (typeof obj !== 'object') {
    return obj
  }

  if (obj === null) {
    return null
  }

  if (Array.isArray(obj)) {
    return cloneArray(obj)
  }

  return cloneObject(obj)
}
