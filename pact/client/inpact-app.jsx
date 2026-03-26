
import { useState, useEffect, useRef } from "react";

// ─── Fonts & Global Styles ───────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d0f14;
      --surface: #13161e;
      --surface2: #1a1e28;
      --surface3: #212636;
      --border: rgba(255,255,255,0.07);
      --border2: rgba(255,255,255,0.12);
      --text: #e8ecf4;
      --muted: #6b7494;
      --accent: #ff5c35;
      --accent2: #ffb830;
      --green: #2ecc71;
      --red: #e74c3c;
      --blue: #4a9eff;
      --purple: #9b59b6;
      --font-head: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 4px; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px; border-radius: 10px; border: none; cursor: pointer;
      font-family: var(--font-body); font-size: 13px; font-weight: 600;
      transition: all .18s ease; text-decoration: none;
    }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { background: #ff7455; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,92,53,.35); }
    .btn-ghost { background: var(--surface3); color: var(--text); }
    .btn-ghost:hover { background: var(--surface2); }
    .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border2); }
    .btn-outline:hover { background: var(--surface2); }
    .btn-green { background: var(--green); color: #fff; }
    .btn-green:hover { opacity: .88; }

    .tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 600;
    }
    .tag-green { background: rgba(46,204,113,.15); color: var(--green); }
    .tag-red { background: rgba(231,76,60,.15); color: var(--red); }
    .tag-yellow { background: rgba(255,184,48,.15); color: var(--accent2); }
    .tag-blue { background: rgba(74,158,255,.15); color: var(--blue); }

    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 20px;
    }
    .card:hover { border-color: var(--border2); }

    input, textarea, select {
      background: var(--surface2); border: 1px solid var(--border);
      color: var(--text); border-radius: 10px;
      padding: 10px 14px; font-family: var(--font-body); font-size: 14px;
      outline: none; transition: border .15s;
      width: 100%;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--accent); }

    .avatar {
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-family: var(--font-head); font-weight: 700; flex-shrink: 0;
    }
    .av-sm { width:32px; height:32px; font-size:12px; }
    .av-md { width:40px; height:40px; font-size:14px; }
    .av-lg { width:48px; height:48px; font-size:16px; }
    .av-xl { width:64px; height:64px; font-size:22px; }

    .progress-bar {
      height: 6px; border-radius: 4px; background: var(--surface3); overflow: hidden;
    }
    .progress-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }

    .fade-in { animation: fadeIn .3s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

    .modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,.65); backdrop-filter:blur(6px);
      z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;
    }
    .modal {
      background:var(--surface); border:1px solid var(--border2); border-radius:20px;
      padding:28px; width:100%; max-width:480px; animation: fadeIn .2s ease;
    }

    .sidebar-link {
      display:flex; align-items:center; gap:10px;
      padding:9px 12px; border-radius:10px; cursor:pointer;
      font-size:14px; font-weight:500; color:var(--muted);
      transition: all .15s; text-decoration:none; border:none; background:none; width:100%;
    }
    .sidebar-link:hover { background:var(--surface2); color:var(--text); }
    .sidebar-link.active { background:var(--surface3); color:var(--text); }

    .badge-icon {
      width:44px; height:44px; border-radius:12px;
      display:flex; align-items:center; justify-content:center; font-size:22px;
      border: 1px solid var(--border2);
    }
    .badge-earned { background: rgba(255,184,48,.1); border-color: rgba(255,184,48,.3); }
    .badge-locked { background: var(--surface2); opacity: .45; filter: grayscale(1); }

    .streak-ring {
      display:inline-flex; align-items:center; justify-content:center;
      border-radius:50%; position:relative;
    }

    .notification-dot {
      width:8px; height:8px; border-radius:50%; background:var(--accent);
      position:absolute; top:1px; right:1px;
    }
  `}</style>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#ff5c35", "#4a9eff", "#2ecc71", "#9b59b6", "#ffb830", "#e74c3c", "#1abc9c"];
const avColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const INITIAL_USER = {
  name: "Neha", xp: 2340, level: 8, streak: 14, personalBest: 21,
  consistency: 96, missedThisMonth: 1, totalXpNeeded: 3000,
  stakeBalance: 4200, vouches: 3,
  badges: ["🔥", "⚡", "🌙", "🏆", "🎯", "💎", "🌱"],
  earnedBadgeCount: 4,
};

const INITIAL_GROUPS = [
  {
    id: 1, name: "The Early Birds", emoji: "🐦", habit: "Morning Run",
    members: 5, streak: 14, stake: 500, type: "manual",
    myDeposit: 1200, depositPerDay: 100,
    description: "Wake up at 5AM and run at least 2km every day.",
    rules: ["Check in before 7AM", "Upload photo/GPS proof", "Miss 3 days = kicked", "Vouch for teammates"],
    members_data: [
      { name: "Neha", streak: 14, consistency: 96, checkedIn: true, time: "6:14 AM", xp: 2340 },
      { name: "Arjun", streak: 14, consistency: 96, checkedIn: true, time: "5:58 AM", xp: 2840 },
      { name: "Rhea", streak: 12, consistency: 92, checkedIn: true, time: "6:32 AM", xp: 2100 },
      { name: "Sam", streak: 10, consistency: 88, checkedIn: true, time: "6:45 AM", xp: 1880 },
      { name: "Karthik", streak: 8, consistency: 76, checkedIn: false, time: null, xp: 1420 },
    ],
    chat: [
      { from: "Arjun", text: "Great run today! 5km done 💪", time: "6:01 AM" },
      { from: "Rhea", text: "Just finished! It was cold but worth it 🥶", time: "6:34 AM" },
      { from: "Sam", text: "Anyone else do a longer route today?", time: "6:47 AM" },
    ],
    milestone: 21,
  },
  {
    id: 2, name: "No Sugar Club", emoji: "🍎", habit: "No Sugar Diet",
    members: 8, streak: 7, stake: 300, type: "api",
    myDeposit: 800, depositPerDay: 50,
    description: "Zero added sugar every day. Track via MyFitnessPal API.",
    rules: ["Log meals daily", "No added sugar", "API auto-verifies", "3 misses = removal"],
    members_data: [
      { name: "Neha", streak: 7, consistency: 100, checkedIn: true, time: "Auto", xp: 980 },
      { name: "Dev", streak: 7, consistency: 100, checkedIn: true, time: "Auto", xp: 1100 },
      { name: "Priya", streak: 5, consistency: 80, checkedIn: true, time: "Auto", xp: 760 },
      { name: "Aman", streak: 3, consistency: 60, checkedIn: false, time: null, xp: 540 },
    ],
    chat: [
      { from: "Dev", text: "Anyone tried those monk fruit sweeteners?", time: "9:12 AM" },
      { from: "Priya", text: "Yes! They're actually great for baking", time: "9:31 AM" },
    ],
    milestone: 21,
  },
];

const DISCOVER_GROUPS = [
  { id: 3, name: "5AM Club", emoji: "⏰", habit: "Wake up at 5AM", members: 12, stake: 500, type: "manual", streak: 22 },
  { id: 4, name: "Book Worms", emoji: "📚", habit: "Read 30 min daily", members: 6, stake: 200, type: "manual", streak: 45 },
  { id: 5, name: "Cold Shower Gang", emoji: "🚿", habit: "Cold shower daily", members: 9, stake: 300, type: "manual", streak: 11 },
  { id: 6, name: "10k Steps", emoji: "👟", habit: "Walk 10,000 steps", members: 15, stake: 400, type: "api", streak: 33 },
];

const MILESTONES = [
  { days: 10, emoji: "🌱", label: "Sprouting", desc: "First 10 days — breaking inertia" },
  { days: 21, emoji: "🔥", label: "Momentum", desc: "21 days — initial habit forming" },
  { days: 60, emoji: "⚡", label: "Automatic", desc: "60 days — habit becomes automatic" },
  { days: 90, emoji: "💎", label: "Lifestyle", desc: "90 days — it's part of who you are" },
  { days: 120, emoji: "🏆", label: "Legend", desc: "120 days — elite consistency" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = "md", style = {} }) => (
  <div className={`avatar av-${size}`} style={{ background: avColor(name), ...style }}>
    {name[0].toUpperCase()}
  </div>
);

const ProgressBar = ({ value, max, color = "#ff5c35", height = 6 }) => (
  <div className="progress-bar" style={{ height }}>
    <div className="progress-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
  </div>
);

const MilestoneTag = ({ days }) => {
  const m = MILESTONES.find(x => x.days === days);
  if (!m) return null;
  return <span className="tag tag-yellow">{m.emoji} {m.label}</span>;
};

// ─── Auth Screen ──────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,53,.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,158,255,.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎯</div>
            <span style={{ fontFamily: "var(--font-head)", fontSize: 30, fontWeight: 800, letterSpacing: "-1px" }}>in<span style={{ color: "var(--accent)" }}>Pact</span></span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Build habits. Hold each other accountable.</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 10, padding: 3, marginBottom: 24 }}>
            {["login", "signup"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, background: tab === t ? "var(--surface3)" : "transparent", color: tab === t ? "var(--text)" : "var(--muted)", transition: "all .15s" }}>
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "signup" && (
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block" }}>Full Name</label>
                <input placeholder="Neha Sharma" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block" }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "block" }}>Password</label>
              <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
            </div>

            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, marginTop: 4 }}
              onClick={() => onLogin(tab === "signup" && name ? name : "Neha")}>
              {tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>

          {tab === "login" && (
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 16 }}>
              Demo: just click Sign In ✓
            </p>
          )}
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 28 }}>
          {["🔥 Group Streaks", "💰 Stake System", "🏆 Leaderboards", "🤝 Accountability", "🏅 Milestone Badges"].map(f => (
            <span key={f} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "var(--muted)" }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, user, groups, collapsed, setCollapsed }) => {
  const links = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "groups", icon: "👥", label: "My Groups", badge: groups.length },
    { id: "checkins", icon: "✅", label: "Check-ins" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
    { id: "badges", icon: "🎖️", label: "Badges" },
    { id: "stakes", icon: "💰", label: "Stakes" },
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={{
      width: collapsed ? 60 : 220,
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      height: "100vh", display: "flex", flexDirection: "column",
      transition: "width .2s ease", overflow: "hidden", flexShrink: 0, position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "16px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, minHeight: 62 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎯</div>
        {!collapsed && <span style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>in<span style={{ color: "var(--accent)" }}>Pact</span></span>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        {!collapsed && <p style={{ fontSize: 10, color: "var(--muted)", padding: "4px 8px", letterSpacing: 1, marginBottom: 4 }}>MAIN</p>}
        {links.slice(0, 4).map(l => (
          <button key={l.id} className={`sidebar-link ${page === l.id ? "active" : ""}`} onClick={() => setPage(l.id)} title={l.label}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{l.icon}</span>
            {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{l.label}</span>}
            {!collapsed && l.badge && <span style={{ marginLeft: "auto", background: "var(--accent)", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{l.badge}</span>}
          </button>
        ))}
        {!collapsed && <p style={{ fontSize: 10, color: "var(--muted)", padding: "4px 8px", letterSpacing: 1, margin: "8px 0 4px" }}>YOU</p>}
        {links.slice(4).map(l => (
          <button key={l.id} className={`sidebar-link ${page === l.id ? "active" : ""}`} onClick={() => setPage(l.id)} title={l.label}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{l.icon}</span>
            {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{l.label}</span>}
          </button>
        ))}
      </nav>

      {/* User at bottom */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={user.name} size="sm" />
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>Lv.{user.level}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ user, activeGroup, page, onLogout }) => {
  const [showNotif, setShowNotif] = useState(false);
  return (
    <div style={{
      height: 60, background: "var(--surface)", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 20px", gap: 16, position: "sticky", top: 0, zIndex: 100
    }}>
      {activeGroup && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface2)", borderRadius: 20, padding: "5px 14px" }}>
          <span>{activeGroup.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{activeGroup.name}</span>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>·</span>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>{activeGroup.members} members</span>
        </div>
      )}
      {activeGroup && (
        <div style={{ background: "rgba(231,76,60,.15)", border: "1px solid rgba(231,76,60,.3)", borderRadius: 20, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="pulse" style={{ color: "var(--accent)" }}>⏱</span>
          <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>4h 23m left to check in</span>
        </div>
      )}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{ position: "relative", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }} onClick={() => setShowNotif(!showNotif)}>
          🔔
          <span className="notification-dot" />
        </button>
        <div style={{ position: "relative" }}>
          <Avatar name={user.name} size="sm" style={{ cursor: "pointer" }} />
        </div>
        <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={onLogout}>Sign out</button>
      </div>
      {showNotif && (
        <div style={{ position: "absolute", top: 64, right: 16, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 16, padding: 16, width: 300, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,.4)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Notifications</p>
          {[
            { t: "Karthik hasn't checked in yet", s: "Early Birds · 2h ago", e: "⚠️" },
            { t: "Arjun vouched for your run", s: "Early Birds · 3h ago", e: "✅" },
            { t: "You're on a 14-day streak!", s: "Milestone approaching · Today", e: "🔥" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 20 }}>{n.e}</span>
              <div><p style={{ fontSize: 13, fontWeight: 500 }}>{n.t}</p><p style={{ fontSize: 11, color: "var(--muted)" }}>{n.s}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ user, groups, setPage, setActiveGroup }) => {
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const myGroup = groups[0];

  return (
    <div className="fade-in" style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 800, marginBottom: 24 }}>
        Good morning, <span style={{ color: "var(--accent)" }}>{user.name}</span> 👋
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          {/* Streak card */}
          <div className="card" style={{ background: "linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%)", marginBottom: 16, border: "1px solid var(--border2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ fontSize: 56, lineHeight: 1 }}>🔥</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 800, color: "var(--accent)" }}>{user.streak}</span>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>Day Group Streak</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  <span className="tag tag-yellow">⚠️ Karthik hasn't checked in yet</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 4 }}>NEXT MILESTONE</p>
                  <p style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800 }}>21 <span style={{ fontSize: 14 }}>days</span></p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 4 }}>STAKE POOL</p>
                  <p style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, color: "var(--accent2)" }}>₹{user.stakeBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Check-in status */}
          <div className="card" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 48, height: 48, borderRadius: 50, background: "rgba(46,204,113,.2)", border: "2px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✅</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>You checked in today!</p>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>Morning Run · Submitted 6:14 AM · 1 pending verification</p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <span className="tag tag-green">✓ Verified by Arjun</span>
                <span className="tag tag-yellow">⏳ Awaiting Rhea</span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => setShowCheckinModal(true)}>View Proof 📸</button>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 16 }}>
            {[
              { label: "YOUR STREAK", main: `${user.streak} 🔥`, sub: `Personal best: ${user.personalBest} days`, color: "var(--accent)" },
              { label: "CONSISTENCY", main: `${user.consistency}%`, sub: `This month · ${user.missedThisMonth} miss`, color: "var(--green)", bar: { v: user.consistency, max: 100, c: "var(--green)" } },
              { label: "XP & LEVEL", main: `Lv. ${user.level}`, sub: `${user.xp} / ${user.totalXpNeeded} XP`, color: "var(--accent2)", bar: { v: user.xp, max: user.totalXpNeeded, c: "var(--accent2)" } },
            ].map((s, i) => (
              <div key={i} className="card">
                <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.main}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: s.bar ? 10 : 0 }}>{s.sub}</p>
                {s.bar && <ProgressBar value={s.bar.v} max={s.bar.max} color={s.bar.c} />}
              </div>
            ))}
          </div>

          {/* Squad ring */}
          <div className="card">
            <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 16 }}>SQUAD RING — TODAY'S STATUS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myGroup.members_data.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 12, background: "var(--surface2)" }}>
                  <Avatar name={m.name} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</span>
                      {m.name === user.name && <span className="tag tag-blue" style={{ fontSize: 10 }}>YOU</span>}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      {m.checkedIn ? `✅ Checked in · ${m.time}` : "⏳ Not checked in yet"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {m.checkedIn
                      ? <span style={{ fontSize: 20 }}>✅</span>
                      : <span className="tag tag-red">At risk ⚠️</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Accountability partner */}
          <div className="card">
            <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 14 }}>👁 ACCOUNTABILITY PARTNER</p>
            <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 10 }}>YOU'RE WATCHING</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name="Arjun" size="md" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700 }}>Arjun</p>
                <p style={{ fontSize: 12, color: "var(--green)" }}>✅ Checked in · 5:58 AM</p>
              </div>
              <button className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>Vouch 🛡</button>
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>{user.vouches} vouch tokens left this month</p>
          </div>

          {/* Mini leaderboard */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>🏆 LEADERBOARD</p>
              <span className="tag tag-blue" style={{ fontSize: 10 }}>This week</span>
            </div>
            {myGroup.members_data.slice().sort((a, b) => b.xp - a.xp).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, width: 16, color: i === 0 ? "var(--accent2)" : "var(--muted)" }}>{i + 1}</span>
                <Avatar name={m.name} size="sm" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{m.name}{m.name === user.name ? " (You)" : ""}</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>{m.consistency}% consistency</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>{m.xp.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="card">
            <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 14 }}>🏅 YOUR BADGES</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {user.badges.map((b, i) => (
                <div key={i} className={`badge-icon ${i < user.earnedBadgeCount ? "badge-earned" : "badge-locked"}`}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Stake summary */}
          <div className="card">
            <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1, marginBottom: 14 }}>💰 STAKE SUMMARY</p>
            {groups.map(g => (
              <div key={g.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{g.emoji} {g.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent2)" }}>₹{g.myDeposit}</span>
                </div>
                <ProgressBar value={g.myDeposit} max={g.myDeposit + 500} color="var(--accent2)" height={4} />
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>₹{g.depositPerDay}/day deducted on miss</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proof modal */}
      {showCheckinModal && (
        <div className="modal-overlay" onClick={() => setShowCheckinModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700 }}>Check-in Proof</h3>
              <button onClick={() => setShowCheckinModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 16, border: "2px dashed var(--border2)" }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>🏃</div>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>Morning Run — 5.2km</p>
              <p style={{ color: "var(--muted)", fontSize: 12 }}>Submitted at 6:14 AM</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <span className="tag tag-green">✓ Verified by Arjun</span>
              <span className="tag tag-yellow">⏳ Awaiting Rhea</span>
            </div>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowCheckinModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Groups List ──────────────────────────────────────────────────────────────
const GroupsPage = ({ groups, setGroups, setPage, setActiveGroup }) => {
  const [tab, setTab] = useState("mine");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(null);
  const [joinDeposit, setJoinDeposit] = useState("");
  const [newGroup, setNewGroup] = useState({ name: "", habit: "", type: "manual", stake: "", emoji: "🎯", description: "" });

  const filtered = DISCOVER_GROUPS.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.habit.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = () => {
    if (!joinDeposit || parseInt(joinDeposit) < showJoin.stake) return;
    const joined = { ...showJoin, myDeposit: parseInt(joinDeposit), depositPerDay: 50, members_data: [], chat: [], rules: [], milestone: 21 };
    setGroups(prev => [...prev, joined]);
    setShowJoin(null);
    setJoinDeposit("");
    setTab("mine");
  };

  const handleCreate = () => {
    if (!newGroup.name || !newGroup.habit) return;
    const g = {
      id: Date.now(), name: newGroup.name, emoji: newGroup.emoji, habit: newGroup.habit,
      members: 1, streak: 0, stake: parseInt(newGroup.stake) || 200, type: newGroup.type,
      myDeposit: parseInt(newGroup.stake) || 200, depositPerDay: 50,
      description: newGroup.description, rules: ["Check in daily", "Upload proof"],
      members_data: [{ name: "Neha", streak: 0, consistency: 100, checkedIn: false, time: null, xp: 0 }],
      chat: [], milestone: 21,
    };
    setGroups(prev => [...prev, g]);
    setShowCreate(false);
    setNewGroup({ name: "", habit: "", type: "manual", stake: "", emoji: "🎯", description: "" });
  };

  return (
    <div className="fade-in" style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800 }}>Groups</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowCreate(true)}>+ Create Group</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "var(--surface2)", borderRadius: 12, padding: 4, marginBottom: 20, width: "fit-content" }}>
        {[{ id: "mine", l: "My Groups" }, { id: "discover", l: "Discover" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, background: tab === t.id ? "var(--surface3)" : "transparent", color: tab === t.id ? "var(--text)" : "var(--muted)", transition: "all .15s" }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === "mine" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {groups.map(g => (
            <div key={g.id} className="card" style={{ cursor: "pointer", transition: "all .2s" }}
              onClick={() => { setActiveGroup(g); setPage("group-detail"); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700 }}>{g.name}</h3>
                    <span className="tag tag-blue" style={{ fontSize: 10 }}>{g.type === "api" ? "🔗 API" : "📸 Manual"}</span>
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{g.habit}</p>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>👥 {g.members} members</span>
                    <span style={{ fontSize: 13, color: "var(--accent)" }}>🔥 {g.streak} day streak</span>
                    <span style={{ fontSize: 13, color: "var(--accent2)" }}>💰 ₹{g.myDeposit} staked</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>›</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <input placeholder="🔍 Search habits, groups..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(g => (
              <div key={g.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{g.name}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{g.habit}</p>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>👥 {g.members}</span>
                    <span style={{ fontSize: 12, color: "var(--accent)" }}>🔥 {g.streak} days</span>
                    <span className="tag tag-yellow" style={{ fontSize: 10 }}>Min ₹{g.stake} stake</span>
                    <span className="tag tag-blue" style={{ fontSize: 10 }}>{g.type === "api" ? "🔗 API" : "📸 Manual"}</span>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowJoin(g); setJoinDeposit(String(g.stake)); }}>Join Group</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800 }}>Join {showJoin.emoji} {showJoin.name}</h3>
              <button onClick={() => setShowJoin(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div className="card" style={{ background: "var(--surface2)", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--text)" }}>Habit:</strong> {showJoin.habit}<br />
                <strong style={{ color: "var(--text)" }}>Members:</strong> {showJoin.members}<br />
                <strong style={{ color: "var(--text)" }}>Streak:</strong> {showJoin.streak} days<br />
                <strong style={{ color: "var(--text)" }}>Min Stake:</strong> ₹{showJoin.stake}
              </p>
            </div>
            <div style={{ background: "rgba(255,184,48,.1)", border: "1px solid rgba(255,184,48,.2)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "var(--accent2)", lineHeight: 1.6 }}>
                ⚠️ <strong>Stake System:</strong> Your deposit decreases by ₹50 per missed day. When balance hits ₹0, you are removed from the group. Consistent members share the forfeited stakes at milestones.
              </p>
            </div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 8 }}>Your Deposit Amount (min ₹{showJoin.stake})</label>
            <input type="number" value={joinDeposit} onChange={e => setJoinDeposit(e.target.value)} style={{ marginBottom: 16 }} placeholder={`Minimum ₹${showJoin.stake}`} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowJoin(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={handleJoin}>
                Deposit ₹{joinDeposit} & Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800 }}>Create New Group</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: "0 0 80px" }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Emoji</label>
                  <input value={newGroup.emoji} onChange={e => setNewGroup({ ...newGroup, emoji: e.target.value })} style={{ textAlign: "center", fontSize: 24 }} maxLength={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Group Name</label>
                  <input value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="e.g. The Early Birds" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Daily Habit</label>
                <input value={newGroup.habit} onChange={e => setNewGroup({ ...newGroup, habit: e.target.value })} placeholder="e.g. Morning Run 5km" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Verification Type</label>
                <select value={newGroup.type} onChange={e => setNewGroup({ ...newGroup, type: e.target.value })}>
                  <option value="manual">📸 Manual — Upload photo proof</option>
                  <option value="api">🔗 API — Auto-verified via app</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Minimum Stake (₹)</label>
                <input type="number" value={newGroup.stake} onChange={e => setNewGroup({ ...newGroup, stake: e.target.value })} placeholder="e.g. 500" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={newGroup.description} onChange={e => setNewGroup({ ...newGroup, description: e.target.value })} placeholder="Rules, goals, expectations..." rows={3} style={{ resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={handleCreate}>Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Group Detail ─────────────────────────────────────────────────────────────
const GroupDetail = ({ group, user, setPage, updateGroup }) => {
  const [tab, setTab] = useState("members");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState(group.chat);
  const [showCheckin, setShowCheckin] = useState(false);
  const [proof, setProof] = useState("");
  const chatRef = useRef(null);

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setMessages(prev => [...prev, { from: user.name, text: chatMsg, time: "Now" }]);
    setChatMsg("");
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
  };

  const doCheckin = () => {
    setShowCheckin(false);
    setProof("");
  };

  const tabs = ["members", "chat", "rules", "attendance", "leaderboard"];

  return (
    <div className="fade-in" style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => setPage("groups")}>← Back to Groups</button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 20, background: "linear-gradient(135deg,var(--surface),var(--surface2))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{group.emoji}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{group.name}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 8 }}>{group.description}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span className="tag tag-green">🔥 {group.streak} day streak</span>
              <span className="tag tag-yellow">💰 ₹{group.myDeposit} your stake</span>
              <span className="tag tag-blue">{group.type === "api" ? "🔗 API verified" : "📸 Manual proof"}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>👥 {group.members} members</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCheckin(true)}>✅ Check In Now</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "var(--surface2)", borderRadius: 12, padding: 4, marginBottom: 20, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", background: tab === t ? "var(--surface3)" : "transparent", color: tab === t ? "var(--text)" : "var(--muted)", transition: "all .15s" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Members */}
      {tab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {group.members_data.map((m, i) => (
            <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar name={m.name} size="md" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>{m.name}</span>
                  {m.name === user.name && <span className="tag tag-blue" style={{ fontSize: 10 }}>YOU</span>}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>🔥 {m.streak} day streak</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{m.consistency}% consistency</span>
                  <span style={{ fontSize: 12, color: "var(--accent2)" }}>⚡ {m.xp} XP</span>
                </div>
                <ProgressBar value={m.streak} max={group.milestone} color="var(--accent)" height={4} />
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.streak}/{group.milestone} days to milestone</p>
              </div>
              <div style={{ textAlign: "right" }}>
                {m.checkedIn
                  ? <span className="tag tag-green">✅ {m.time}</span>
                  : <span className="tag tag-red">⏳ Pending</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat */}
      {tab === "chat" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", height: 460 }}>
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, paddingRight: 4 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: m.from === user.name ? "row-reverse" : "row" }}>
                <Avatar name={m.from} size="sm" />
                <div style={{ maxWidth: "70%" }}>
                  {m.from !== user.name && <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>{m.from}</p>}
                  <div style={{ background: m.from === user.name ? "var(--accent)" : "var(--surface2)", borderRadius: 12, padding: "8px 12px", borderBottomRightRadius: m.from === user.name ? 4 : 12, borderBottomLeftRadius: m.from !== user.name ? 4 : 12 }}>
                    <p style={{ fontSize: 13 }}>{m.text}</p>
                  </div>
                  <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textAlign: m.from === user.name ? "right" : "left" }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && sendMsg()} />
            <button className="btn btn-primary" onClick={sendMsg}>Send</button>
          </div>
        </div>
      )}

      {/* Rules */}
      {tab === "rules" && (
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📋 Group Rules</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {group.rules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px", background: "var(--surface2)", borderRadius: 12 }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <p style={{ fontSize: 14 }}>{r}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, background: "rgba(255,184,48,.08)", border: "1px solid rgba(255,184,48,.2)", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "var(--accent2)", fontWeight: 600, marginBottom: 6 }}>⚠️ Stake Penalty System</p>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
              • Miss a day: <strong style={{ color: "var(--text)" }}>₹{group.depositPerDay} deducted</strong> from your stake<br />
              • Balance reaches ₹0: <strong style={{ color: "var(--red)" }}>Auto-removed from group</strong><br />
              • Forfeited stakes distributed to consistent members at milestone<br />
              • Top 3 at milestone earn bonus XP
            </p>
          </div>
        </div>
      )}

      {/* Attendance */}
      {tab === "attendance" && (
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📅 Attendance (Last 14 Days)</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", color: "var(--muted)", fontWeight: 500 }}>Member</th>
                  {Array.from({ length: 14 }, (_, i) => (
                    <th key={i} style={{ padding: "8px 4px", color: "var(--muted)", fontWeight: 500, textAlign: "center", fontSize: 11 }}>D{14 - i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.members_data.map((m, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{m.name}</td>
                    {Array.from({ length: 14 }, (_, j) => {
                      const missed = Math.random() > (m.consistency / 100);
                      return (
                        <td key={j} style={{ padding: "8px 4px", textAlign: "center" }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, background: missed ? "var(--surface3)" : "rgba(46,204,113,.3)", border: `1px solid ${missed ? "var(--border)" : "rgba(46,204,113,.4)"}`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                            {missed ? "·" : "✓"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Group Leaderboard */}
      {tab === "leaderboard" && (
        <div>
          {group.members_data.slice().sort((a, b) => b.xp - a.xp).map((m, i) => (
            <div key={i} className="card" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? "rgba(255,184,48,.15)" : i === 1 ? "rgba(255,255,255,.06)" : i === 2 ? "rgba(255,128,0,.1)" : "var(--surface2)", border: `1px solid ${i === 0 ? "rgba(255,184,48,.3)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>
              <Avatar name={m.name} size="md" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>{m.name}</span>
                  {m.name === user.name && <span className="tag tag-blue" style={{ fontSize: 10 }}>YOU</span>}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>🔥 {m.streak} days</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{m.consistency}% consistency</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800 }}>{m.xp}</p>
                <p style={{ fontSize: 11, color: "var(--muted)" }}>XP</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckin && (
        <div className="modal-overlay" onClick={() => setShowCheckin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800 }}>✅ Check In — {group.name}</h3>
              <button onClick={() => setShowCheckin(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            {group.type === "manual" ? (
              <>
                <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>Upload photo or video proof of your {group.habit.toLowerCase()}.</p>
                <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 32, textAlign: "center", border: "2px dashed var(--border2)", cursor: "pointer", marginBottom: 16 }}
                  onClick={() => setProof("uploaded")}>
                  {proof ? (
                    <div>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>📸</div>
                      <p style={{ color: "var(--green)", fontWeight: 600 }}>Photo uploaded!</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                      <p style={{ color: "var(--muted)" }}>Tap to upload proof</p>
                      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Photo, video, or GPS screenshot</p>
                    </div>
                  )}
                </div>
                <textarea value={proof === "uploaded" ? "Morning run complete — 5.2km in 28 mins!" : ""} readOnly placeholder="Add a note (optional)..." rows={2} style={{ marginBottom: 16 }} />
              </>
            ) : (
              <div style={{ background: "rgba(74,158,255,.1)", border: "1px solid rgba(74,158,255,.2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <p style={{ color: "var(--blue)", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>🔗 API Auto-Verification</p>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>Your {group.habit} is automatically tracked via the connected app. No manual upload needed.</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowCheckin(false)}>Cancel</button>
              <button className="btn btn-green" style={{ flex: 1, justifyContent: "center" }} onClick={doCheckin}>Submit Check-in ✅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Leaderboard ──────────────────────────────────────────────────────────────
const LeaderboardPage = ({ user, groups }) => {
  const [period, setPeriod] = useState("week");
  const allMembers = groups.flatMap(g => g.members_data).reduce((acc, m) => {
    const ex = acc.find(x => x.name === m.name);
    if (ex) { ex.xp += m.xp; ex.streak = Math.max(ex.streak, m.streak); }
    else acc.push({ ...m });
    return acc;
  }, []).sort((a, b) => b.xp - a.xp);

  return (
    <div className="fade-in" style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800 }}>🏆 Leaderboard</h2>
        <div style={{ display: "flex", gap: 4, background: "var(--surface2)", borderRadius: 10, padding: 3 }}>
          {["week", "month", "alltime"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, background: period === p ? "var(--surface3)" : "transparent", color: period === p ? "var(--text)" : "var(--muted)", transition: "all .15s" }}>
              {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12, marginBottom: 28, padding: "0 20px" }}>
        {[1, 0, 2].map(rank => {
          const m = allMembers[rank];
          if (!m) return null;
          const heights = [80, 100, 65];
          const colors = ["#c0c0c0", "#ffb830", "#cd7f32"];
          return (
            <div key={rank} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar name={m.name} size={rank === 0 ? "xl" : "lg"} style={{ marginBottom: 8, border: `3px solid ${colors[rank]}` }} />
              <p style={{ fontWeight: 700, fontSize: rank === 0 ? 16 : 14, marginBottom: 2 }}>{m.name}{m.name === user.name ? " (You)" : ""}</p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{m.xp} XP</p>
              <div style={{ width: "100%", height: heights[rank], background: `rgba(${rank === 0 ? "192,192,192" : rank === 1 ? "255,184,48" : "205,127,50"},.15)`, border: `1px solid rgba(${rank === 0 ? "192,192,192" : rank === 1 ? "255,184,48" : "205,127,50"},.3)`, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20 }}>
                {rank === 0 ? "🥈" : rank === 1 ? "🥇" : "🥉"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest */}
      {allMembers.slice(3).map((m, i) => (
        <div key={i} className="card" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--muted)", width: 24, textAlign: "center" }}>{i + 4}</span>
          <Avatar name={m.name} size="sm" />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600 }}>{m.name}{m.name === user.name ? " (You)" : ""}</span>
            <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>🔥 {m.streak} days</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{m.consistency}% consistent</span>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16 }}>{m.xp} <span style={{ fontSize: 12, color: "var(--muted)" }}>XP</span></p>
        </div>
      ))}
    </div>
  );
};

// ─── Badges ───────────────────────────────────────────────────────────────────
const BadgesPage = ({ user }) => (
  <div className="fade-in" style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🏅 Badges & Milestones</h2>
    <div className="card" style={{ marginBottom: 20 }}>
      <p style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>The Psychology of Habits</p>
      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>Badges are awarded at key psychological milestones: 21 days to build initial momentum, 60 days for the habit to become automatic, 90 days for it to become part of your lifestyle, and 120 days for legendary consistency.</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {MILESTONES.map((m, i) => {
        const earned = user.streak >= m.days || (i < 2);
        return (
          <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 16, opacity: earned ? 1 : .6 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: earned ? "rgba(255,184,48,.12)" : "var(--surface2)", border: `1px solid ${earned ? "rgba(255,184,48,.3)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, filter: earned ? "none" : "grayscale(1)" }}>
              {m.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <p style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700 }}>{m.label}</p>
                <span className={`tag ${earned ? "tag-green" : "tag-yellow"}`}>{earned ? "✓ Earned" : "🔒 Locked"}</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>{m.desc}</p>
              <ProgressBar value={Math.min(user.streak, m.days)} max={m.days} color={earned ? "var(--green)" : "var(--accent)"} height={5} />
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{Math.min(user.streak, m.days)}/{m.days} days</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Stakes ───────────────────────────────────────────────────────────────────
const StakesPage = ({ user, groups }) => (
  <div className="fade-in" style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>💰 Stakes & Deposits</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
      {[
        { label: "Total Staked", value: `₹${groups.reduce((s, g) => s + g.myDeposit, 0).toLocaleString()}`, icon: "💰", color: "var(--accent2)" },
        { label: "At Risk Today", value: `₹${groups.filter(g => !g.members_data.find(m => m.name === user.name)?.checkedIn).reduce((s, g) => s + g.depositPerDay, 0)}`, icon: "⚠️", color: "var(--red)" },
        { label: "Saved by Streaks", value: "₹1,400", icon: "🏆", color: "var(--green)" },
      ].map((s, i) => (
        <div key={i} className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
          <p style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</p>
        </div>
      ))}
    </div>
    {groups.map(g => (
      <div key={g.id} className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 24 }}>{g.emoji}</span>
          <div>
            <p style={{ fontWeight: 700 }}>{g.name}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>₹{g.depositPerDay} per missed day</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800, color: "var(--accent2)" }}>₹{g.myDeposit}</p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>remaining</p>
          </div>
        </div>
        <ProgressBar value={g.myDeposit} max={g.myDeposit + 600} color="var(--accent2)" />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>₹0 (kicked)</span>
          <span style={{ fontSize: 12, color: "var(--green)" }}>₹{g.myDeposit + 600} (max)</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>+ Top Up Stake</button>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>View History</button>
        </div>
      </div>
    ))}
    <div style={{ background: "rgba(255,92,53,.08)", border: "1px solid rgba(255,92,53,.2)", borderRadius: 14, padding: 16 }}>
      <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>How the Stake System Works</p>
      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
        Your stake is your commitment. Miss a day → lose ₹{groups[0]?.depositPerDay}. Hit ₹0 → removed.
        The forfeited stakes are redistributed to consistent members at milestone celebrations (21, 60, 90, 120 days).
        This creates skin in the game — real accountability.
      </p>
    </div>
  </div>
);

// ─── Profile ──────────────────────────────────────────────────────────────────
const ProfilePage = ({ user, groups }) => (
  <div className="fade-in" style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>👤 Profile</h2>
    <div className="card" style={{ marginBottom: 20, textAlign: "center", background: "linear-gradient(135deg,var(--surface),var(--surface2))" }}>
      <Avatar name={user.name} size="xl" style={{ margin: "0 auto 14px", width: 72, height: 72, fontSize: 28 }} />
      <h3 style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{user.name}</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <span className="tag tag-yellow">Level {user.level}</span>
        <span className="tag tag-green">🔥 {user.streak} day streak</span>
        <span className="tag tag-blue">⚡ {user.xp} XP</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, padding: "0 20px" }}>
        {[
          { label: "Personal Best", value: `${user.personalBest} days` },
          { label: "Consistency", value: `${user.consistency}%` },
          { label: "Groups", value: groups.length },
        ].map((s, i) => (
          <div key={i}>
            <p style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="card" style={{ marginBottom: 14 }}>
      <p style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>XP Progress</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13 }}>Level {user.level}</span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{user.xp}/{user.totalXpNeeded} XP to Level {user.level + 1}</span>
      </div>
      <ProgressBar value={user.xp} max={user.totalXpNeeded} color="var(--accent2)" height={10} />
    </div>

    <div className="card">
      <p style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>My Groups</p>
      {groups.map(g => (
        <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, padding: "10px", background: "var(--surface2)", borderRadius: 12 }}>
          <span style={{ fontSize: 22 }}>{g.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>{g.habit}</p>
          </div>
          <span className="tag tag-green">🔥 {g.streak}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Check-ins Page ───────────────────────────────────────────────────────────
const CheckinsPage = ({ user, groups }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [proof, setProof] = useState("");

  return (
    <div className="fade-in" style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800 }}>✅ Check-ins</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Check-in</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {groups.map(g => {
          const me = g.members_data.find(m => m.name === user.name);
          return (
            <div key={g.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{g.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{g.name}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{g.habit}</p>
                </div>
                {me?.checkedIn
                  ? <span className="tag tag-green">✅ Done · {me.time}</span>
                  : <span className="tag tag-red">⏳ Pending</span>}
              </div>
              {!me?.checkedIn && (
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setSelectedGroup(g); setShowModal(true); }}>
                  Check in for {g.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 800 }}>Check In</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>Group</label>
              <select value={selectedGroup.id} onChange={e => setSelectedGroup(groups.find(g => g.id === parseInt(e.target.value)))}>
                {groups.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>)}
              </select>
            </div>
            {selectedGroup.type === "manual" ? (
              <>
                <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 24, textAlign: "center", border: "2px dashed var(--border2)", cursor: "pointer", marginBottom: 14 }}
                  onClick={() => setProof("uploaded")}>
                  {proof ? <div><div style={{ fontSize: 36, marginBottom: 6 }}>📸</div><p style={{ color: "var(--green)", fontWeight: 600 }}>Proof uploaded!</p></div>
                    : <div><div style={{ fontSize: 36, marginBottom: 6 }}>📷</div><p style={{ color: "var(--muted)" }}>Upload photo/video proof</p></div>}
                </div>
                <textarea placeholder="Add note (optional)..." rows={2} style={{ marginBottom: 14 }} />
              </>
            ) : (
              <div style={{ background: "rgba(74,158,255,.1)", border: "1px solid rgba(74,158,255,.2)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <p style={{ color: "var(--blue)", fontSize: 13 }}>🔗 Auto-synced via API — no upload needed</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-green" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowModal(false)}>Submit ✅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Settings ─────────────────────────────────────────────────────────────────
const SettingsPage = ({ onLogout }) => (
  <div className="fade-in" style={{ padding: "24px", maxWidth: 600, margin: "0 auto" }}>
    <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>⚙️ Settings</h2>
    {[
      { section: "Account", items: ["Edit Profile", "Change Password", "Notification Preferences", "Connected Apps (API)"] },
      { section: "Groups", items: ["Check-in Reminders", "Verification Settings", "Invite Friends"] },
      { section: "Payments", items: ["Payment Methods", "Transaction History", "Withdraw Earnings"] },
    ].map(s => (
      <div key={s.section} className="card" style={{ marginBottom: 14 }}>
        <p style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--muted)" }}>{s.section.toUpperCase()}</p>
        {s.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < s.items.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
            <span style={{ fontSize: 14 }}>{item}</span>
            <span style={{ color: "var(--muted)" }}>›</span>
          </div>
        ))}
      </div>
    ))}
    <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center", color: "var(--red)", borderColor: "rgba(231,76,60,.3)" }} onClick={onLogout}>
      Sign Out
    </button>
  </div>
);

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [page, setPage] = useState("dashboard");
  const [activeGroup, setActiveGroup] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (name) => {
    setUser({ ...INITIAL_USER, name });
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    setPage("dashboard");
  };

  const topGroup = activeGroup || groups[0];

  if (!authed) return (
    <>
      <GlobalStyle />
      <AuthScreen onLogin={handleLogin} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={user} groups={groups} setPage={setPage} setActiveGroup={setActiveGroup} />;
      case "groups": return <GroupsPage groups={groups} setGroups={setGroups} setPage={setPage} setActiveGroup={setActiveGroup} />;
      case "group-detail": return activeGroup ? <GroupDetail group={activeGroup} user={user} setPage={setPage} updateGroup={() => { }} /> : null;
      case "checkins": return <CheckinsPage user={user} groups={groups} />;
      case "leaderboard": return <LeaderboardPage user={user} groups={groups} />;
      case "badges": return <BadgesPage user={user} />;
      case "stakes": return <StakesPage user={user} groups={groups} />;
      case "profile": return <ProfilePage user={user} groups={groups} />;
      case "settings": return <SettingsPage onLogout={handleLogout} />;
      default: return <Dashboard user={user} groups={groups} setPage={setPage} setActiveGroup={setActiveGroup} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar page={page} setPage={(p) => { setPage(p); if (p !== "group-detail") setActiveGroup(null); }} user={user} groups={groups} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Topbar user={user} activeGroup={page === "group-detail" ? activeGroup : null} page={page} onLogout={handleLogout} />
          <main style={{ flex: 1, overflowY: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
