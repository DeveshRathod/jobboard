import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { jobsApi, applicationApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MapPin, DollarSign, Clock, Briefcase, ExternalLink,
  Bookmark, BookmarkCheck, Users, ChevronLeft, AlertCircle
} from 'lucide-react'
import { timeAgo, formatDate, formatSalary, JOB_TYPE_COLORS, getInitials } from '../utils'

export default function JobDetailPage() {
  const { slug } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    jobsApi.detail(slug)
      .then(({ data }) => {
        setJob(data)
        setSaved(data.is_saved)
      })
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return navigate('/login')
    setApplying(true)
    try {
      await applicationApi.create({ job_id: job.id, cover_letter: coverLetter, portfolio_url: portfolioUrl })
      toast.success('Application submitted!')
      setShowApplyForm(false)
      setJob(prev => ({ ...prev, has_applied: true }))
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.[0] || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please sign in first')
    const { data } = await jobsApi.toggleSave(slug)
    setSaved(data.saved)
    toast.success(data.message)
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-48 bg-gray-200 rounded" />
    </div>
  )

  if (!job) return null

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/jobs" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {getInitials(job.company_name)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-gray-600 mt-1">{job.company_name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`badge ${JOB_TYPE_COLORS[job.job_type]}`}>{job.job_type.replace('-', ' ')}</span>
                    {job.is_remote && <span className="badge bg-teal-100 text-teal-800">Remote</span>}
                    <span className="badge bg-purple-100 text-purple-800 capitalize">{job.experience_level}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="text-gray-400 hover:text-blue-600 transition-colors mt-1">
                {saved ? <BookmarkCheck className="w-6 h-6 text-blue-600" /> : <Bookmark className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{job.location}</span>
              {salary && job.show_salary && (
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" />{salary}/yr</span>
              )}
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" />Posted {timeAgo(job.created_at)}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" />{job.application_count} applicants</span>
            </div>

            {job.deadline && (
              <div className="flex items-center gap-2 mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4" />
                Application deadline: {formatDate(job.deadline)}
              </div>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.responsibilities}</p>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.benefits}</p>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply button */}
          <div className="card text-center">
            {job.has_applied ? (
              <div className="text-green-600 font-medium py-2">
                ✅ You've already applied!
              </div>
            ) : user?.role === 'employer' ? (
              <p className="text-sm text-gray-500">Employers cannot apply to jobs.</p>
            ) : (
              <>
                {!showApplyForm ? (
                  <button
                    onClick={() => isAuthenticated ? setShowApplyForm(true) : navigate('/login')}
                    className="btn-primary w-full text-base py-3"
                  >
                    Apply Now
                  </button>
                ) : (
                  <form onSubmit={handleApply} className="text-left space-y-4">
                    <h3 className="font-semibold text-gray-900">Apply for this job</h3>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Cover Letter *</label>
                      <textarea
                        required
                        rows={6}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="input resize-none"
                        placeholder="Why are you a great fit for this role?"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Portfolio URL</label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="input"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={applying} className="btn-primary flex-1">
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Company info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">About {job.company_name}</h3>
            {job.company_description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-4">{job.company_description}</p>
            )}
            {job.company_website && (
              <a href={job.company_website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> Visit Website
              </a>
            )}
          </div>

          {/* Job summary */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Job Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium capitalize">{job.job_type.replace('-', ' ')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Level</dt>
                <dd className="font-medium capitalize">{job.experience_level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium">{job.location}</dd>
              </div>
              {salary && job.show_salary && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Salary</dt>
                  <dd className="font-medium">{salary}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Views</dt>
                <dd className="font-medium">{job.views_count}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
