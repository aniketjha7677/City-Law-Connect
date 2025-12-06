import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, MapPin, Bell, Shield, CreditCard, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>('profile')
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    location: user?.user_metadata?.location || '',
    phone: '',
    bio: '',
  })
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    caseUpdates: true,
    lawyerMessages: true,
    legalNews: true,
  })

  const handleSaveProfile = () => {
    // In real app, this would update Supabase
    toast.success('Profile updated successfully!')
  }

  const handleSaveNotifications = () => {
    // In real app, this would update Supabase
    toast.success('Notification settings updated!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <User size={18} className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Bell size={18} className="inline mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'security' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Shield size={18} className="inline mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'billing' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <CreditCard size={18} className="inline mr-2" />
              Billing
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="input-field pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-secondary mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="input-field"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button onClick={handleSaveProfile} className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-bold">Email Notifications</h3>
                    <p className="text-sm text-secondary">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.email}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-bold">SMS Notifications</h3>
                    <p className="text-sm text-secondary">Receive urgent notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, sms: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-bold">Case Updates</h3>
                    <p className="text-sm text-secondary">Get notified about case status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.caseUpdates}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, caseUpdates: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-bold">Lawyer Messages</h3>
                    <p className="text-sm text-secondary">Notifications when your lawyer sends a message</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.lawyerMessages}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, lawyerMessages: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-bold">Legal News</h3>
                    <p className="text-sm text-secondary">Receive updates about legal news and law changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.legalNews}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, legalNews: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <button onClick={handleSaveNotifications} className="btn-primary">
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input type="password" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input type="password" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input type="password" className="input-field" />
                    </div>
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h3>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-secondary mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center space-x-2">
                      <Trash2 size={18} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Billing & Payment</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
                  <p className="text-secondary mb-4">No payment methods on file</p>
                  <button className="btn-primary">Add Payment Method</button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold mb-4">Billing History</h3>
                  <p className="text-secondary">No billing history available</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

