import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // this pulls the ":id" from the url and save it here,  the url definition is in the app.jsx
  // if the url was something like "http.../notes/note_id"  the code should be "const {node_id} = useParams();"
  const {id} = useParams();

  const handleDelete = async (e) => {
        // since the entire note card  is a link that redirected to notedetailed page, we want to prevent the default behaviour of redirecting to note detail page
        e.preventDefault();
        
        // ask user confirmation for note deletion, if false do nothing and return from the function 
        if (!window.confirm("Are you sure you want to delete the note? ")) return;

        try {
            await api.delete(`notes/${id}`);
            toast.success("Note Deleted Successfully!");
            navigate("/");
        } 
        catch (error) 
        {
            console.log("Error when deleting note : ", error);
            toast.error("Failed to delete the note!");
        }

  };

  const handleSave = async (e) => {
    // prevent page refresh 
    e.preventDefault();

    if (!note.title.trim() || !note.content.trim())
    {
      toast.error("All fields are required!");
      return;
    }

    // when setloading is true, the create new note button is diabled
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note Saved Successfully!");
      // redirect user to home page
      navigate("/");
    } 
    catch (error) {
      console.log("Error Saving note", error);
      if(error.response?.status === 429)
      {
        toast.error("Slow down turbo! You are Saving notes too fast", {
          duration : 5000,
          icon : "🚨"
        })
      }
      else
      {
        toast.error("Failed to Save note!");
      }
    }
    finally
    {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchNote = async() =>{
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } 
      catch (error) {
        if(error.response?.status === 429)
        {
          toast.error("Slow down turbo! You are loading the note too much", {
            duration : 5000,
            icon : "🚨"
          })
        }
        else
        {
          console.log(`Error loading note ${id}: `, error);
          toast.error("Failed to laod the note!");
        }
      }
      finally
      {
        setLoading(false)
      }
    }

    fetchNote();
  }, [id]);

  if (loading)
  {
    return(
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5"/> 
              Back To Notes
            </Link>
            <button onClick={handleDelete} className="btn text-red-500 btn-outline hover:text-white hover:bg-red-700">
              <Trash2Icon className="size-5"/>
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100 ">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Note Title" 
                    className="input input-bordered"
                    value = {note.title}
                    onChange={(e) => setNote({...note, title : (e.target.value)})}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea 
                    placeholder="Write your note here..." 
                    className="textarea textarea-bordered h-32"
                    value = {note.content}
                    onChange={(e) => setNote({...note, content : (e.target.value)})}
                  />
                </div>

                <div className="card-actions justify-end">
                  {/*                                                  if the button is clicked and a note is being created, diable the button untill note is created */}
                  <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage