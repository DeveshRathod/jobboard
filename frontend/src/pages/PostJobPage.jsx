import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, X } from 'lucide-react'

export default function PostJobPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', responsibilities: '', benefits: '',
    category: '', company_name: user?.company_name || '', company_website: '', company_description: '',
    location: '', is_remote: false, job_type: 'full-time', experience_level: 'mid',
    salary_min: '', salary_max: '', salary_currency: 'USD', show_salary: true,
    skills: [], status: 'open', deadline: '',
  })

  useEffect(() => {
    jobsApi.categories().then(({ data }) => setCategories(data))
  }, [])

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const addSkill = () => {
    const skill = skillInput.trim()
    if (skill && !form.skills.includes(skill)) {
      update('skills', [...form.skills, skill])
      setSkillInput('')
    }
  }

  const removeSkill = (s) => update('skills', form.skills.filter(sk => sk !== s))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.salary_min) delete payload.salary_min
      if (!payload.salary_max) delete payload.salary_max
      if (!payload.category) delete payload.category
      if (!payload.deadline) delete payload.deadline
      const { data } = await jobsApi.create(payload)
      toast.success('Job posted successfully!')
      navigate(`/jobs/${data.slug}`)
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.entries(errors).forEach(([k, v]) => toast.error(`${k}: ${v}`))
      } else {
        toast.error('Failed to post job')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Job Title *</label>
            <input required className="input" placeholder="e.g., Senior Frontend Developer"
              value={form.title} onChange={(e) => update('title', e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Job Type *</label>
              <select className="input" value={form.job_type} onChange={(e) => update('job_type', e.target.value)}>
                {['full-time', 'part-time', 'contract', 'freelance', 'internship', 'remote'].map(t => (
                  <option key={t} value={t} className="capitalize">{t.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Experience Level *</label>
              <select className="input" value={form.experience_level} onChange={(e) => update('experience_level', e.target.value)}>
                {['entry', 'mid', 'senior', 'lead', 'executive'].map(l => (
                  <option key={l} value={l} className="capitalize">{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select className="input" value={form.category} onChange={(e) => update('category', e.target.value)}>
                <option value="">Select category</option>
                {Array.isArray(categories) &&
                  categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
              <select className="input" value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="open">Open (Published)</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Application Deadline</label>
            <input type="date" className="input" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
          </div>
        </div>

        {/* Location & Salary */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Location & Compensation</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Location *</label>
              <input required className="input" placeholder="e.g., San Francisco, CA"
                value={form.location} onChange={(e) => update('location', e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="remote" checked={form.is_remote}
                onChange={(e) => update('is_remote', e.target.checked)} className="rounded" />
              <label htmlFor="remote" className="text-sm text-gray-700">Remote friendly</label>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Min Salary</label>
              <input type="number" className="input" placeholder="80000"
                value={form.salary_min} onChange={(e) => update('salary_min', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Max Salary</label>
              <input type="number" className="input" placeholder="120000"
                value={form.salary_max} onChange={(e) => update('salary_max', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Currency</label>
              <select className="input" value={form.salary_currency} onChange={(e) => update('salary_currency', e.target.value)}>
                {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="showSalary" checked={form.show_salary}
              onChange={(e) => update('show_salary', e.target.checked)} className="rounded" />
            <label htmlFor="showSalary" className="text-sm text-gray-700">Show salary publicly</label>
          </div>
        </div>

        {/* Description */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Job Details</h2>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
            <textarea required rows={5} className="input resize-none"
              placeholder="Describe the role, team, and what you're looking for..."
              value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Requirements *</label>
            <textarea required rows={4} className="input resize-none"
              placeholder="List required skills, experience, education..."
              value={form.requirements} onChange={(e) => update('requirements', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Responsibilities</label>
            <textarea rows={4} className="input resize-none"
              placeholder="Day-to-day duties and responsibilities..."
              value={form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Benefits & Perks</label>
            <textarea rows={3} className="input resize-none"
              placeholder="Health insurance, equity, remote work..."
              value={form.benefits} onChange={(e) => update('benefits', e.target.value)} />
          </div>
        </div>

        {/* Skills */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Required Skills</h2>
          <div className="flex gap-2">
            <input className="input" placeholder="Add a skill (e.g., React)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            />
            <button type="button" onClick={addSkill} className="btn-secondary flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Company */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Company Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Company Name *</label>
              <input required className="input" value={form.company_name}
                onChange={(e) => update('company_name', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Company Website</label>
              <input type="url" className="input" placeholder="https://company.com"
                value={form.company_website} onChange={(e) => update('company_website', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Company Description</label>
            <textarea rows={3} className="input resize-none" placeholder="Brief company overview..."
              value={form.company_description} onChange={(e) => update('company_description', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
