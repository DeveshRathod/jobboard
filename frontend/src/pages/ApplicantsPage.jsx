import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobsApi, applicationApi } from '../api'
import { timeAgo, APPLICATION_STATUS_COLORS } from '../utils'
import toast from 'react-hot-toast'
import { ChevronLeft, ExternalLink } from 'lucide-react'

const ALL_STATUSES = ['pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected']

export default function ApplicantsPage() {
  const { slug } = useParams()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([
      jobsApi.detail(slug),
      jobsApi.jobApplications(slug)
    ]).then(([jobRes, appRes]) => {
      setJob(jobRes.data)
      setApplications(appRes.data.results || appRes.data)
    }).finally(() => setLoading(false))
  }, [slug])

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationApi.update(appId, { status: newStatus })
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      if (selected?.id === appId) setSelected(prev => ({ ...prev, status: newStatus }))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8 text-gray-500">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications for: {job?.title}</h1>
        <p className="text-gray-500">{applications.length} total applicants</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Applications list */}
        <div className="lg:col-span-2 space-y-3">
          {applications.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-gray-500">No applications yet</p>
            </div>
          ) : applications.map(app => (
            <div
              key={app.id}
              onClick={() => setSelected(app)}
              className={`card cursor-pointer transition-all hover:border-blue-300 ${selected?.id === app.id ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {app.applicant?.first_name} {app.applicant?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">@{app.applicant?.username}</p>
                </div>
                <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]} capitalize text-xs flex-shrink-0`}>
                  {app.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{timeAgo(app.created_at)}</p>
            </div>
          ))}
        </div>

        {/* Application detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selected.applicant?.first_name} {selected.applicant?.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{selected.applicant?.bio}</p>
                  {selected.applicant?.location && (
                    <p className="text-sm text-gray-500">📍 {selected.applicant.location}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {selected.portfolio_url && (
                    <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer"
                      className="btn-secondary text-xs flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Portfolio
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selected.id, status)}
                      className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${selected.status === status ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cover Letter</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 rounded-lg p-4 leading-relaxed">
                  {selected.cover_letter}
                </p>
              </div>

              {selected.expected_salary && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Expected Salary</h3>
                  <p className="text-gray-700">${Number(selected.expected_salary).toLocaleString()}</p>
                </div>
              )}

              <div className="text-xs text-gray-400">
                Applied {timeAgo(selected.created_at)}
              </div>
            </div>
          ) : (
            <div className="card text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">👆</p>
              <p>Select an applicant to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
