import React from 'react'
import { useContext } from 'react'
import MessagesContext from '../../Contexts/MessageContext.jsx'

export default function Chat() {
  const {messages} = useContext(MessagesContext)

  return (
    <div>pepe estuvo aqui</div>
  )
}
