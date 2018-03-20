import React from 'react'
import files from '../img/*.jpg'

export const images = Object.values(files).map(src => <img key={src} src={src} />)
