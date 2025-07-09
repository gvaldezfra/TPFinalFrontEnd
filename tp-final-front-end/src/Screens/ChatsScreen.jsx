import React, { useContext, useState, useMemo } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import ContactsList from '../Components/Contacts/ContactList.jsx';
import Chat from '../Components/Chat/Chat.jsx';

export default function ChatScreen() {
    const { messagesByContact, sendMessage } = useContext(MessageContext);

    const [contacts] = useState([
        { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1' },
        { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2' },
    ]);

    const [activeContactId, setActiveContactId] = useState(contacts[0]?.id || null);

    const contactsWithLastMessage = useMemo(() => {
        return contacts.map(contact => {
            const messages = messagesByContact[contact.id] || [];
            const lastMsg = messages[messages.length - 1];
            return {
                ...contact,
                lastMessage: lastMsg?.text,
                lastMessageTime: lastMsg?.timestamp,
            };
        });
    }, [contacts, messagesByContact]);

    const messages = messagesByContact[activeContactId] || [];

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <ContactsList
                contacts={contactsWithLastMessage}
                activeContactId={activeContactId}
                onSelect={setActiveContactId}
            />
            <Chat
                contact={contacts.find(c => c.id === activeContactId)}
                messages={messages}
                onSendMessage={(text) => sendMessage(activeContactId, text)}
            />
        </div>
    );
}
