import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    phone: user?.phone || '',
    linkedin_url: user?.linkedin_url || '',
    company_name: user?.company_name || '',
  })
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '' })
  const [saving, setSaving] = useState(false)
  const [changingPass, setChangingPass] = useState(false)

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await authApi.updateProfile(form)
      updateUser(data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setChangingPass(true)
    try {
      await authApi.changePassword(passwords)
      toast.success('Password changed!')
      setPasswords({ old_password: '', new_password: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setChangingPass(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

      {/* Profile form */}
      <form onSubmit={handleProfile} className="card space-y-4">
        <h2 className="font-semibold text-gray-900">Personal Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
            <input className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
            <input className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
          <input className="input bg-gray-50" value={user?.email} disabled />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
          <textarea rows={3} className="input resize-none"
            placeholder="Tell employers about yourself..."
            value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
            <input className="input" placeholder="City, Country" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">LinkedIn URL</label>
          <input type="url" className="input" placeholder="https://linkedin.com/in/..."
            value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
        </div>

        {user?.role === 'employer' && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Company Name</label>
            <input className="input" value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={handlePassword} className="card space-y-4">
        <h2 className="font-semibold text-gray-900">Change Password</h2>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
          <input type="password" required className="input" value={passwords.old_password}
            onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
          <input type="password" required className="input" value={passwords.new_password}
            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
        </div>
        <button type="submit" disabled={changingPass} className="btn-primary">
          {changingPass ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
