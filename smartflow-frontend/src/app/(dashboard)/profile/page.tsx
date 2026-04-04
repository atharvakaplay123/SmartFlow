export default function ProfilePage() {
  const profileData = {
    name: 'Admin User',
    email: 'admin@smartflow.city',
    city: 'New Delhi',
    role: 'Traffic Control Admin',
    department: 'Smart City Operations',
    employeeId: 'SF-ADM-004',
    since: '2023',
    phone: '+91 98765 43210',
  };

  const stats = [
    { label: 'Signals Managed', value: '4' },
    { label: 'Overrides Triggered', value: '7' },
    { label: 'AI Runs Today', value: '240' },
    { label: 'Uptime', value: '99.98%' },
  ];

  const permissions = ['View Dashboard', 'Control Signals', 'Emergency Override', 'View Analytics', 'Export Reports'];

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-0.5">Administrator account details and permissions</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-cyan-500/30">
              A
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0d1326]" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-white text-xl font-bold">{profileData.name}</h2>
            <p className="text-cyan-400 text-sm font-medium">{profileData.role}</p>
            <p className="text-slate-500 text-sm">{profileData.department}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full">🏙️ {profileData.city}</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">✅ Online</span>
              <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded-full">Since {profileData.since}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#1e2d4d]">
          {[
            { label: 'Email', value: profileData.email, icon: '✉️' },
            { label: 'Phone', value: profileData.phone, icon: '📞' },
            { label: 'Employee ID', value: profileData.employeeId, icon: '🪪' },
            { label: 'City', value: profileData.city, icon: '🌆' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider">{item.label}</p>
                <p className="text-white text-sm font-medium mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-cyan-400">{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Permissions */}
      <div className="bg-[#0d1326]/80 backdrop-blur-xl border border-[#1e2d4d] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-400 to-purple-600" />
          Permissions
        </h2>
        <div className="flex flex-wrap gap-2">
          {permissions.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
