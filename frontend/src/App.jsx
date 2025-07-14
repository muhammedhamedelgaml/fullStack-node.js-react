import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from './config';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    const res = await axios.get(`${API_BASE}/api/notes`);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addOrEditNote = async () => {
    if (!newNote.trim()) return;

    if (editingId) {
      await axios.put(`${API_BASE}/api/notes/${editingId}`, { content: newNote });
    } else {
      await axios.post(`${API_BASE}/api/notes`, { content: newNote });
    }
    setNewNote('');
    setEditingId(null);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_BASE}/api/notes/${id}`);
    fetchNotes();
  };

  const startEdit = (note) => {
    setNewNote(note.content);
    setEditingId(note.id);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 Notes App</h1>
      <input
        placeholder="Write a note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        style={{ width: '300px', padding: '8px' }}
      />
      <button onClick={addOrEditNote} style={{ marginLeft: '10px' }}>
        {editingId ? '💾 Save' : '➕ Add'}
      </button>

      <ul style={{ marginTop: '1rem' }}>
        {notes.map(note => (
          <li key={note.id}>
            {note.content}
            <button onClick={() => startEdit(note)} style={{ marginLeft: '10px' }}>✏️</button>
            <button onClick={() => deleteNote(note.id)} style={{ marginLeft: '5px' }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

