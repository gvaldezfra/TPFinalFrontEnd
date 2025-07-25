import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './styles/newMessageForm.css';
import { IoMdSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { MdAddPhotoAlternate } from "react-icons/md";

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
      onSend({ type: 'image', data: imagePreview });
      setImageFile(null);
      setImagePreview(null);
      setText('');
      setShowEmojiPicker(false);
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
    // Limpia el input para poder subir la misma imagen si se quiere
    e.target.value = '';
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
          aria-label="Mostrar selector de emojis"
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
          aria-label="Escribir mensaje"
        />

        <label className="image-upload-button" title="Enviar imagen" aria-label="Subir imagen">
          <MdAddPhotoAlternate size={30}/>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </label>

        <button
          type="submit"
          className="new-message-button"
          aria-label="Enviar mensaje"
        >
          <IoMdSend />
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
          <button
            onClick={cancelImage}
            className="cancel-image-button"
            aria-label="Cancelar imagen seleccionada"
          >
            <IoMdClose size={15}/>
          </button>
        </div>
      )}
    </div>
  );
}
