

export default function ToolBar({ addNote }) {

    return (
        <button className='txt-btn' onClick={addNote}>
            Add note +
        </button>
    )
}