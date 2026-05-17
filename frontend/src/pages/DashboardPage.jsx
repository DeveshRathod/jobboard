import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { jobsApi, applicationApi } from '../api'
import { timeAgo, APPLICATION_STATUS_COLORS, formatDate } from '../utils'
import { Plus, Briefcase, Users, Eye, TrendingUp, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === 'employer') return <EmployerDashboard />
  return <SeekerDashboard />
}

function SeekerDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationApi.list()
      .then(({ data }) => setApplications(data.results || data))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => ['shortlisted', 'interviewed'].includes(a.status)).length,
    offers: applications.filter(a => a.status === 'offered').length,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500">Track your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: stats.total, icon: Briefcase, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
          { label: 'Shortlisted', value: stats.shortlisted, icon: TrendingUp, color: 'purple' },
          { label: 'Offers', value: stats.offers, icon: CheckCircle, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center">
            <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Applications list */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">My Applications</h2>
          <Link to="/jobs" className="btn-primary text-sm">Find More Jobs</Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 mb-4">No applications yet</p>
            <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map(app => (
              <div key={app.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link to={`/jobs/${app.job?.slug}`} className="font-medium text-gray-900 hover:text-blue-600 truncate block">
                    {app.job?.title}
                  </Link>
                  <p className="text-sm text-gray-500">{app.job?.company_name} • {timeAgo(app.created_at)}</p>
                </div>
                <span className={`badge ${APPLICATION_STATUS_COLORS[app.status]} capitalize flex-shrink-0`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsApi.myJobs()
      .then(({ data }) => setJobs(data.results || data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (slug) => {
    if (!confirm('Delete this job posting?')) return
    try {
      await jobsApi.delete(slug)
      setJobs(jobs.filter(j => j.slug !== slug))
      toast.success('Job deleted')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    applications: jobs.reduce((acc, j) => acc + (j.application_count || 0), 0),
    views: jobs.reduce((acc, j) => acc + (j.views_count || 0), 0),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-500">{user?.company_name}</p>
        </div>
        <Link to="/post-job" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'blue' },
          { label: 'Active Jobs', value: stats.open, icon: CheckCircle, color: 'green' },
          { label: 'Applications', value: stats.applications, icon: Users, color: 'purple' },
          { label: 'Total Views', value: stats.views, icon: Eye, color: 'orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center">
            <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="card overflow-hidden">
        <h2 className="font-semibold text-gray-900 mb-4">Your Job Postings</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📌</p>
            <p className="text-gray-500 mb-4">No jobs posted yet</p>
            <Link to="/post-job" className="btn-primary">Post Your First Job</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-3">Job Title</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-center pb-3">Apps</th>
                  <th className="text-center pb-3">Views</th>
                  <th className="text-left pb-3">Posted</th>
                  <th className="text-right pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link to={`/jobs/${job.slug}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">
                        {job.title}
                      </Link>
                      <p className="text-xs text-gray-500 capitalize">{job.job_type}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge ${job.status === 'open' ? 'bg-green-100 text-green-800' : job.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-800'} capitalize`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Link to={`/jobs/${job.slug}/applicants`} className="text-sm font-medium text-blue-600 hover:underline">
                        {job.application_count}
                      </Link>
                    </td>
                    <td className="py-3 text-center text-sm text-gray-600">{job.views_count}</td>
                    <td className="py-3 text-sm text-gray-500">{timeAgo(job.created_at)}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/jobs/${job.slug}/applicants`} className="text-xs text-blue-600 hover:underline">View Apps</Link>
                        <button onClick={() => handleDelete(job.slug)} className="text-xs text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
