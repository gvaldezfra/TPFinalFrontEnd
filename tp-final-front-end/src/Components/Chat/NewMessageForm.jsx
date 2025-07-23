import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './styles/newMessageForm.css';

export default function NewMessageForm({ onSend }) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (imagePreview) {
      handleSendImage();
      return;
    }

    if (!text.trim()) return;

    onSend(text);
    setText('');
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emojiObject) => {
    setText(prev => prev + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = () => {
    if (imagePreview) {
      onSend({ type: 'image', data: imagePreview });
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const cancelImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="new-message-wrapper">
      <form onSubmit={handleSubmit} className="new-message-form">
        <button
          type="button"
          className="emoji-button"
          onClick={() => setShowEmojiPicker(prev => !prev)}
          title="Agregar emoji"
          ref={buttonRef}
        >
          😀
        </button>

        <input
          className="new-message-input"
          type="text"
          placeholder="Escribí un mensaje..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <label className="image-upload-button" title="Enviar imagen">
          📷
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </label>

        <button type="submit" className="new-message-button">
          Enviar
        </button>
      </form>

      {showEmojiPicker && (
        <div className="emoji-picker-container" ref={pickerRef}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="preview" className="image-preview" />
          <button onClick={cancelImage} className="cancel-image-button">❌</button>
          <button onClick={handleSendImage} className="send-image-button">📤</button>
        </div>
      )}
    </div>
  );
}
