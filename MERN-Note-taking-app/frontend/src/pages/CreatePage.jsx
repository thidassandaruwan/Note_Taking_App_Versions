import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../lib/axios.js"

const CreatePage = () => {
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // prevent page refresh 
    e.preventDefault();

    if (!title.trim() || !content.trim())
    {
      toast.error("All fields are required!");
      return;
    }

    // when setloading is true, the create new note button is diabled
    setLoading(true);
    try {
      await api.post("/notes", {title, content});
      toast.success("Note Created Successfully!");
      // redirect user to home page
      navigate("/");
    } 
    catch (error) {
      console.log("Error creating note", error);
      if(error.response?.status === 429)
      {
        toast.error("Slow down turbo! You are creating notes too fast", {
          duration : 5000,
          icon : "🚨"
        })
      }
      else
      {
        toast.error("Failed to create note!");
      }
    }
    finally
    {
      setLoading(false);
    }
  };
  
  return (
  <div className="min-h-screen bg-base-200 ">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5"/> 
            Back To Notes
          </Link>

          <div className="card bg-base-100 ">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Note Title" 
                    className="input input-bordered"
                    value = {title}
                    onChange={(e) => {setTitle(e.target.value)}}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea 
                    placeholder="Write your note here..." 
                    className="textarea textarea-bordered h-32"
                    value = {content}
                    onChange={(e) => {setContent(e.target.value)}}
                  />
                </div>

                <div className="card-actions justify-end">
                  {/*                                                  if the button is clicked and a note is being created, diable the button untill note is created */}
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating" : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePage