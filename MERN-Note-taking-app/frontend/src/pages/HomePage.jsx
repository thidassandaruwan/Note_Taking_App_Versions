import { useEffect, useState } from "react"
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios.js"
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        // 
        setNotes(res.data);
        // if we do get the data, it means we are not rate limited anymore
        setIsRateLimited(false);
      } 
      catch (error) {
        // chceking if response status is 429      adding ? in the response.status checks if error.response exist before comparing with 429
        if(error.response?.status === 429)
        {
          // set ratelimited to true, which causes to RateLimitedUI to show up in the home page
          setIsRateLimited(true);
        }
        else
        {
          toast.error("Failed to load notes!");
        }
      }
      // no matter is the get request is success or failed, stop requesting notes 
      finally
      {
        // set loading to false
        setLoading(false);
      }
    }

    fetchNotes();
  },[])

  return (
    <div className="min-h-screen">
      {/* this is just a if condition in react. functionality is similar to   if(isRateLimited){<RateLimitedUI/>} */}
      {isRateLimited && <RateLimitedUI/>}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {/* check if notes are loading, and if so display "Loading notes... text" */}
        {loading && <div className="text-center text-primary  py-10">Loading Notes...</div>}

        {/* if no notes avaiable to shoq */}
        {notes.length === 0 && !isRateLimited && !loading && <NotesNotFound/>}

        {/* if notes were retrived and we are not ratelimited */}
        {notes.length > 0 && !isRateLimited && (
          //                  grid columns of 1, medium screens : grid columns of 2  larger screens: grid columns of 3 (tailwind css breakpoints)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* create a note component for each note in the notes */}
            {notes.map(note => (
              <NoteCard key={note._id} note={note} setNotes={setNotes}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage