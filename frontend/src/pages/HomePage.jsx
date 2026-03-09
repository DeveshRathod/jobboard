import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobsApi } from '../api'
import JobCard from '../components/JobCard'
import { Search, MapPin, TrendingUp, Users, Briefcase, Building2, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [stats, setStats] = useState(null)
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    jobsApi.stats().then(({ data }) => setStats(data))
    jobsApi.list({ page_size: 6 }).then(({ data }) => setFeaturedJobs(data.results || []))
    jobsApi.categories().then(({ data }) => setCategories(data.results || []))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Find Your Dream Job Today
          </h1>
          <p className="text-blue-100 text-lg mb-10">
            Discover thousands of job opportunities from top companies around the world.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors w-full sm:w-auto">
              Search
            </button>
          </form>

          <p className="text-blue-200 text-sm mt-4">
            Popular: <span className="text-white cursor-pointer hover:underline" onClick={() => navigate('/jobs?search=React')}>React</span> · {' '}
            <span className="text-white cursor-pointer hover:underline" onClick={() => navigate('/jobs?search=Python')}>Python</span> · {' '}
            <span className="text-white cursor-pointer hover:underline" onClick={() => navigate('/jobs?is_remote=true')}>Remote</span> · {' '}
            <span className="text-white cursor-pointer hover:underline" onClick={() => navigate('/jobs?job_type=internship')}>Internship</span>
          </p>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Briefcase, label: 'Open Jobs', value: stats.total_jobs?.toLocaleString() },
              { icon: Building2, label: 'Companies', value: stats.total_companies?.toLocaleString() },
              { icon: TrendingUp, label: 'Categories', value: stats.total_categories },
              { icon: Users, label: 'Job Seekers', value: '50k+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-500 mt-1">Explore opportunities in your field</p>
            </div>
            <Link to="/jobs" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/jobs?category=${cat.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500">{cat.job_count} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Job Openings</h2>
                <p className="text-gray-500 mt-1">Freshly posted opportunities</p>
              </div>
              <Link to="/jobs" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                See all jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
            <div className="text-center mt-8">
              <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
                View All Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hire Top Talent?</h2>
          <p className="text-blue-100 mb-8">Post your job listing and reach thousands of qualified candidates today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=employer" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors">
              Post a Job Free
            </Link>
            <Link to="/jobs" className="border border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-colors">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 text-center text-sm">
        <p>© 2024 JobBoard. Built with Django & React.</p>
      </footer>
    </div>
  )
}
