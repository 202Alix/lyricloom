import { useState } from 'react'
import './App.css';
import StickyNote from "./components/StickyNote"
import ToolBar from "./components/ToolBar"


function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  function addNote() {
    const newId = Date.now();
    setNotes([
      ...notes,
      {
        id: newId,
        initialEditable: true
      }
    ]);
    setSelectedNoteId(newId);
  }

  function deleteNote(id) {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  }

  return (
    <div className="App">
      {notes.map(item => (
        <StickyNote
          key={item.id}
          initialEditable={item.initialEditable}
          isSelected={selectedNoteId === item.id}
          onSelect={() => setSelectedNoteId(item.id)}
          onDelete={() => deleteNote(item.id)}
        />
      ))}
      <ToolBar addNote={addNote} />
    </div>
  );
}

export default App;
