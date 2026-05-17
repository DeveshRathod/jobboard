import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Users } from 'lucide-react'
import { timeAgo, formatSalary, JOB_TYPE_COLORS, getInitials } from '../utils'
import { jobsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function JobCard({ job, onSaveToggle }) {
  const { isAuthenticated } = useAuth()
  const [saved, setSaved] = useState(job.is_saved)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please sign in to save jobs')
      return
    }
    setSaving(true)
    try {
      const { data } = await jobsApi.toggleSave(job.slug)
      setSaved(data.saved)
      toast.success(data.message)
      onSaveToggle?.()
    } catch {
      toast.error('Failed to save job')
    } finally {
      setSaving(false)
    }
  }

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency)

  return (
    <Link to={`/jobs/${job.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Company Logo / Initials */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {job.company_logo
                ? <img src={job.company_logo} alt={job.company_name} className="w-12 h-12 rounded-xl object-cover" />
                : getInitials(job.company_name)
              }
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{job.company_name}</p>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5"
          >
            {saved
              ? <BookmarkCheck className="w-5 h-5 text-blue-600" />
              : <Bookmark className="w-5 h-5" />
            }
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`badge ${JOB_TYPE_COLORS[job.job_type] || 'bg-gray-100 text-gray-700'}`}>
            {job.job_type.replace('-', ' ')}
          </span>
          {job.is_remote && (
            <span className="badge bg-teal-100 text-teal-800">Remote</span>
          )}
          {job.experience_level && (
            <span className="badge bg-purple-100 text-purple-800 capitalize">
              {job.experience_level}
            </span>
          )}
          {job.has_applied && (
            <span className="badge bg-green-100 text-green-800">Applied ✓</span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
          {salary && job.show_salary && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {salary}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(job.created_at)}
          </span>
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
            {job.skills.slice(0, 4).map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-xs px-2 py-0.5 text-gray-400">+{job.skills.length - 4} more</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
