import React from 'react'
import { createRoot } from 'react-dom/client'
import Game from './components/Game'

import './styles/game'
import 'react-toastify/dist/ReactToastify.min.css'

const container = document.getElementById('game')
const root = createRoot(container)

root.render(<Game />)
