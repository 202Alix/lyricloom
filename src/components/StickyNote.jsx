import { useState, useRef, useEffect } from "react";

export default function StickyNote({ onDelete, initialEditable = false, isSelected, onSelect }) {
    const [allowMove, setAllowMove] = useState(false);
    const [isEditable, setIsEditable] = useState(initialEditable);
    const [text, setText] = useState("");
    const stickyNoteRef = useRef();
    const textareaRef = useRef();
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    function handleMouseDown(e) {
        setAllowMove(true);
        const dimensions = stickyNoteRef.current.getBoundingClientRect();
        setDx(e.clientX - dimensions.x);
        setDy(e.clientY - dimensions.y);
    }

    function handleMouseMove(e) {
        if (allowMove) {
            const x = e.clientX - dx;
            const y = e.clientY - dy;
            stickyNoteRef.current.style.left = x + "px";
            stickyNoteRef.current.style.top = y + "px";
        }
    }

    function handleMouseUp() {
        setAllowMove(false);
    }

    function handleClick() {
        onSelect?.();
        setIsEditable(false); // single click: not editable
    }

    function handleDoubleClick() {
        setIsEditable(true);
        textareaRef.current.focus();
    }

    // When initialEditable is true, focus and select the note
    useEffect(() => {
        if (initialEditable && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [initialEditable]);

    // Delete sticky note when selected + Backspace, regardless of textarea focus or content
    useEffect(() => {
        function handleKeyDown(e) {
            if (isSelected && e.key === "Backspace" && !isEditable) {
                e.preventDefault();
                onDelete?.();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSelected, onDelete, isEditable]);

    // Auto-delete note if textarea is empty and not selected
    useEffect(() => {
        if (text.trim() === "" && !isSelected) {
            onDelete?.();
        }
    }, [text, isSelected, onDelete]);

    return (
        <div
            className={`stickyNote${isSelected ? " selected" : ""}`}
            ref={stickyNoteRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <textarea
                id="stickyNoteText"
                ref={textareaRef}
                readOnly={!isEditable}
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ cursor: isEditable ? "text" : "default" }}
            />
        </div>
    );
}