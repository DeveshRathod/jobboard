import { useState, useEffect } from 'react'
import { jobsApi } from '../api'
import JobCard from '../components/JobCard'
import { BookmarkCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = () => {
    jobsApi.savedJobs()
      .then(({ data }) => setSavedJobs(data.results || data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSaved() }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkCheck className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <span className="badge bg-blue-100 text-blue-800">{savedJobs.length}</span>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔖</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-500 mb-6">Bookmark jobs to apply to them later</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {savedJobs.map(({ job }) => (
            <JobCard key={job.id} job={job} onSaveToggle={fetchSaved} />
          ))}
        </div>
      )}
    </div>
  )
}
