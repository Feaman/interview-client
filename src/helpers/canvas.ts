export function getCrop(
  image: HTMLImageElement | undefined,
  size: { width: number, height: number },
  clipPosition = 'center-middle',
) {
  if (!image) {
    throw new Error('No image provided')
  }

  const { width } = size
  const { height } = size
  const aspectRatio = width / height

  let newWidth
  let newHeight

  const imageRatio = image.width / image.height

  if (aspectRatio >= imageRatio) {
    newWidth = image.width
    newHeight = image.width / aspectRatio
  } else {
    newWidth = image.height * aspectRatio
    newHeight = image.height
  }

  let x = 0
  let y = 0
  if (clipPosition === 'left-top') {
    x = 0
    y = 0
  } else if (clipPosition === 'left-middle') {
    x = 0
    y = (image.height - newHeight) / 2
  } else if (clipPosition === 'left-bottom') {
    x = 0
    y = image.height - newHeight
  } else if (clipPosition === 'center-top') {
    x = (image.width - newWidth) / 2
    y = 0
  } else if (clipPosition === 'center-middle') {
    x = (image.width - newWidth) / 2
    y = (image.height - newHeight) / 2
  } else if (clipPosition === 'center-bottom') {
    x = (image.width - newWidth) / 2
    y = image.height - newHeight
  } else if (clipPosition === 'right-top') {
    x = image.width - newWidth
    y = 0
  } else if (clipPosition === 'right-middle') {
    x = image.width - newWidth
    y = (image.height - newHeight) / 2
  } else if (clipPosition === 'right-bottom') {
    x = image.width - newWidth
    y = image.height - newHeight
  } else if (clipPosition === 'scale') {
    x = 0
    y = 0
    newWidth = width
    newHeight = height
  } else {
    throw new Error(`Unknown clip position property - ${clipPosition}`)
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  }
}

export function downloadURI(uri: string, name: string) {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getFontLoader() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('No canvas context')
  }
  ctx.font = 'bold 20px Roboto'

  let isFontLoaded = false
  const TEXT_TEXT = 'Some test text;'
  const initialMeasure = ctx.measureText(TEXT_TEXT)
  const initialWidth = initialMeasure.width

  return function whenFontIsLoaded(callback: () => void, attemptCount = 0) {
    if (attemptCount === undefined) {
      attemptCount = 0
    }
    if (attemptCount >= 20) {
      callback()
      return
    }
    if (isFontLoaded) {
      callback()
      return
    }
    const metrics = ctx.measureText(TEXT_TEXT)
    const { width } = metrics
    if (width !== initialWidth) {
      isFontLoaded = true
      callback()
    } else {
      setTimeout(() => {
        whenFontIsLoaded(callback, attemptCount + 1)
      }, 500)
    }
  }
}
