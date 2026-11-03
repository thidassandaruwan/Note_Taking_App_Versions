import { PenSquareIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router"
import { formatDate } from "../lib/utils"
import api from "../lib/axios"
import toast from "react-hot-toast"

const NoteCard = ({note, setNotes}) => {

    const handleDelete = async (e, noteId) => {
        // since the entire note card  is a link that redirected to notedetailed page, we want to prevent the default behaviour of redirecting to note detail page
        e.preventDefault();
        
        // ask user confirmation for note deletion, if false do nothing and return from the function 
        if (!window.confirm("Are you sure you want to delete the note? ")) return;

        try {
            await api.delete(`notes/${noteId}`);
            // removing the deleted note from the existing note list in the browser memory (using the noteID)
            setNotes((prev) => prev.filter(note => note._id !== noteId))
            toast.success("Note Deleted Successfully!");
        } 
        catch (error) 
        {
            console.log("Error when deleting note : ", error);
            toast.error("Failed to delete the note!");
        }

    };

  return (
    <Link to={`/note/${note._id}`}
    className="card bg-base-100 hover:shadow-xl transition-all duration-200 border-t-4 border-solid border-primary">
    <div className="card-body border border-primary rounded-xl">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4 ">
            <span className="text-sm text-base-content/60">{formatDate(new Date(note.createdAt))}</span>
            {/* // buttons */}
            <div className="flex items-center gap-1">
                <PenSquareIcon className="size-4"/>
                <button className="btn btn-ghost btn-xs text-red-600" onClick={ (e) => handleDelete(e, note._id)}>
                    <Trash2Icon className="size-4"/>
                </button>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default NoteCard