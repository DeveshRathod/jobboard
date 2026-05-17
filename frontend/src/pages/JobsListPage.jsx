import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { jobsApi } from '../api'
import JobCard from '../components/JobCard'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'remote']
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive']

export default function JobsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const location = searchParams.get('location') || ''
  const jobType = searchParams.get('job_type') || ''
  const experienceLevel = searchParams.get('experience_level') || ''
  const category = searchParams.get('category') || ''
  const isRemote = searchParams.get('is_remote') || ''

  const fetchJobs = () => {
    setLoading(true)
    const params = { page }
    if (search) params.search = search
    if (location) params.location = location
    if (jobType) params.job_type = jobType
    if (experienceLevel) params.experience_level = experienceLevel
    if (category) params.category = category
    if (isRemote) params.is_remote = isRemote

    jobsApi.list(params)
      .then(({ data }) => {
        setJobs(data.results || [])
        setTotal(data.count || 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    jobsApi.categories().then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, location, jobType, experienceLevel, category, isRemote])

  useEffect(() => {
    fetchJobs()
  }, [search, location, jobType, experienceLevel, category, isRemote, page])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})

  const hasActiveFilters = jobType || experienceLevel || category || isRemote

  const totalPages = Math.ceil(total / 10)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
          <input
            className="input sm:w-48"
            placeholder="Location"
            value={location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => updateFilter('job_type', jobType === type ? '' : type)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${jobType === type ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Experience</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => updateFilter('experience_level', experienceLevel === level ? '' : level)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${experienceLevel === level ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Category</label>
              <select
                className="input text-sm"
                value={category}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name} ({cat.job_count})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remote"
                checked={isRemote === 'true'}
                onChange={(e) => updateFilter('is_remote', e.target.checked ? 'true' : '')}
                className="rounded"
              />
              <label htmlFor="remote" className="text-sm text-gray-700">Remote only</label>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                <X className="w-4 h-4" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${total.toLocaleString()} job${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear all filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => <JobCard key={job.id} job={job} onSaveToggle={fetchJobs} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="btn-secondary p-2 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="btn-secondary p-2 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
