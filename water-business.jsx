import { useState } from "react";

const STORAGE_KEY = "aqua_biz_v5";
const defaultData = {
  inventory: { stored: 0, sold: 0, bought: 0 },
  deliveries: [],
  inventoryLog: [],
  users: {
    admin:    { password: "admin123", role: "admin",    name: "Admin" },
    manager:  { password: "mgr123",   role: "manager",  name: "Manager" },
    delivery1:{ password: "del1123",  role: "delivery", name: "Sk Rayan" },
    delivery2:{ password: "del2123",  role: "delivery", name: "Sourav Barman" },
    delivery3:{ password: "del3123",  role: "delivery", name: "Omar" },
  },
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const p = JSON.parse(raw); return { ...defaultData, ...p, users: p.users || defaultData.users }; }
  } catch {}
  return defaultData;
}
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

const Icon = ({ d, size=20, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IC = {
  delivery:"M1 3h15v13H1zM16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  manager: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  admin:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  plus:    "M12 5v14M5 12h14",
  box:     "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  chart:   "M18 20V10 M12 20V4 M6 20v-6",
  cash:    "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  card:    "M1 4h22v16H1z M1 10h22",
  check:   "M20 6L9 17l-5-5",
  history: "M3 12a9 9 0 109 9 M3 12V6 M3 12H9",
  user:    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  bottle:  "M8 2h8 M9 2v2.789a4 4 0 01-.672 2.219l-.656.984A4 4 0 007 10.212V20a2 2 0 002 2h6a2 2 0 002-2v-9.789a4 4 0 00-.672-2.219l-.656-.984A4 4 0 0115 4.788V2",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  key:     "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  x:       "M18 6L6 18M6 6l12 12",
};

const now = () => new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();
const initials = (n="") => n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

const PAY_METHODS = [
  { value:"cash", label:"💵 Cash",          cls:"pay-cash" },
  { value:"upi",  label:"📱 UPI / Online",  cls:"pay-upi"  },
  { value:"bank", label:"🏦 Bank Transfer", cls:"pay-bank" },
  { value:"card", label:"💳 Card",          cls:"pay-card" },
  { value:"due",  label:"⏳ Due",           cls:"pay-due"  },
];
const payLabel = (v) => PAY_METHODS.find(p=>p.value===v)?.label || v;
const payCls   = (v) => PAY_METHODS.find(p=>p.value===v)?.cls   || "pay-cash";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --deep:#050e1a;--navy:#0a1628;--card:#0d1f35;--card2:#112236;
  --border:rgba(56,160,255,0.15);--accent:#38a0ff;--accent2:#00e5c4;
  --text:#d4e8ff;--muted:#6b90b8;--danger:#ff4d6d;--warning:#ffaa00;
  --success:#00d48a;--white:#ffffff;
}
body{background:var(--deep);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh}
.app{min-height:100vh;display:flex;flex-direction:column}

.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse at 30% 50%,#0a2a4a 0%,var(--deep) 70%);position:relative;overflow:hidden}
.login-bg{position:absolute;border-radius:50%;filter:blur(80px);opacity:.18;pointer-events:none}
.login-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:48px 40px;
  width:420px;max-width:95vw;box-shadow:0 32px 80px rgba(0,0,0,.5);position:relative;z-index:2;animation:fu .5s ease}
@keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.lli{width:48px;height:48px;background:linear-gradient(135deg,#38a0ff,#00e5c4);border-radius:14px;display:flex;align-items:center;justify-content:center}
.lt{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--white)}
.ls{font-size:13px;color:var(--muted)}
.lh2{font-family:'Syne',sans-serif;font-size:28px;font-weight:700;color:var(--white);margin-bottom:8px}
.ld{font-size:14px;color:var(--muted);margin-bottom:32px}

.field{margin-bottom:16px}
.field label{display:block;font-size:12px;font-weight:500;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px}
.field input,.field select{width:100%;background:var(--navy);border:1px solid var(--border);border-radius:10px;
  padding:11px 15px;color:var(--text);font-size:15px;outline:none;transition:border-color .2s;font-family:'DM Sans',sans-serif}
.field input:focus,.field select:focus{border-color:var(--accent)}
.field select option{background:var(--navy)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 20px;border-radius:10px;
  border:none;cursor:pointer;font-size:14px;font-weight:500;font-family:'DM Sans',sans-serif;transition:all .2s}
.btn-primary{background:linear-gradient(135deg,#38a0ff,#0077e6);color:#fff;box-shadow:0 4px 18px rgba(56,160,255,.35)}
.btn-primary:hover{transform:translateY(-1px)}
.btn-teal{background:linear-gradient(135deg,#00e5c4,#00a896);color:#fff;box-shadow:0 4px 14px rgba(0,229,196,.3)}
.btn-teal:hover{transform:translateY(-1px)}
.btn-warn{background:rgba(255,170,0,.15);color:var(--warning);border:1px solid rgba(255,170,0,.3)}
.btn-warn:hover{background:rgba(255,170,0,.25)}
.btn-danger{background:rgba(255,77,109,.15);color:var(--danger);border:1px solid rgba(255,77,109,.3)}
.btn-danger:hover{background:rgba(255,77,109,.25)}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--text);border-color:var(--accent)}
.btn-sm{padding:6px 13px;font-size:12px;border-radius:8px}
.btn-full{width:100%}
.err{color:var(--danger);font-size:13px;margin-top:8px}
.ok{color:var(--success);font-size:13px;margin-top:8px}

.header{display:flex;align-items:center;justify-content:space-between;padding:15px 28px;
  background:var(--navy);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
.hlogo{display:flex;align-items:center;gap:10px}
.hli{width:34px;height:34px;background:linear-gradient(135deg,#38a0ff,#00e5c4);border-radius:9px;display:flex;align-items:center;justify-content:center}
.htitle{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--white)}
.hright{display:flex;align-items:center;gap:14px}
.rbadge{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.07em}
.r-admin{background:rgba(255,170,0,.15);color:var(--warning);border:1px solid rgba(255,170,0,.3)}
.r-manager{background:rgba(56,160,255,.15);color:var(--accent);border:1px solid rgba(56,160,255,.3)}
.r-delivery{background:rgba(0,229,196,.12);color:var(--accent2);border:1px solid rgba(0,229,196,.3)}

.main{flex:1;padding:28px;max-width:1200px;margin:0 auto;width:100%}
.ptitle{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--white);margin-bottom:5px;display:flex;align-items:center;gap:10px}
.psub{font-size:13px;color:var(--muted);margin-bottom:28px}

.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(0,0,0,.2);margin-bottom:20px}
.ctitle{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--white);margin-bottom:16px;display:flex;align-items:center;gap:7px}

.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:24px}
.sc{background:var(--card2);border:1px solid var(--border);border-radius:14px;padding:20px;position:relative;overflow:hidden}
.slabel{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px}
.sval{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--white);line-height:1}
.sunit{font-size:12px;color:var(--muted);margin-top:3px}
.sicon{position:absolute;right:16px;top:16px;opacity:.13}

.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:9px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);border-bottom:1px solid var(--border);font-weight:600}
td{padding:12px;border-bottom:1px solid rgba(56,160,255,.07);color:var(--text)}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(56,160,255,.04)}

.frow{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;align-items:end}
.fa{display:flex;gap:9px;margin-top:14px;flex-wrap:wrap}

.tabs{display:flex;gap:5px;margin-bottom:22px;background:var(--navy);border-radius:11px;padding:4px;width:fit-content;flex-wrap:wrap}
.tab{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:500;color:var(--muted);background:transparent;transition:all .2s;white-space:nowrap}
.tab.active{background:var(--card);color:var(--white);box-shadow:0 2px 8px rgba(0,0,0,.3)}

.pay-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:500}
.pay-cash{background:rgba(0,212,138,.15);color:var(--success)}
.pay-upi {background:rgba(167,139,250,.2);color:#a78bfa}
.pay-bank{background:rgba(255,170,0,.15);color:var(--warning)}
.pay-card{background:rgba(56,160,255,.15);color:var(--accent)}
.pay-due {background:rgba(255,77,109,.15);color:var(--danger)}

.sect2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:740px){.sect2{grid-template-columns:1fr}.frow{grid-template-columns:1fr}}

.dmeta{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.av{border-radius:11px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;
  background:linear-gradient(135deg,rgba(0,229,196,.3),rgba(56,160,255,.3));color:var(--white);border:1px solid var(--border);flex-shrink:0}
.dn{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;color:var(--white)}
.dr{font-size:12px;color:var(--muted)}

.dcards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.dc{background:var(--card2);border:1px solid var(--border);border-radius:13px;padding:16px}
.dch{display:flex;align-items:center;gap:9px;margin-bottom:12px}
.dcn{font-weight:600;color:var(--white);font-size:14px}
.dcc{font-size:12px;color:var(--muted)}

.urow{display:flex;align-items:center;gap:10px;padding:13px;border-radius:11px;border:1px solid var(--border);margin-bottom:9px;background:var(--card2);flex-wrap:wrap}
.urow-info{flex:1;min-width:100px}
.urow-actions{display:flex;gap:7px;flex-wrap:wrap}

.mo{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.mb{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:28px;width:450px;max-width:100%;box-shadow:0 24px 60px rgba(0,0,0,.6);animation:fu .3s ease}
.mtitle{font-family:'Syne',sans-serif;font-size:19px;font-weight:700;color:var(--white);margin-bottom:18px;display:flex;align-items:center;gap:8px}
.mclose{margin-left:auto;background:transparent;border:none;cursor:pointer;color:var(--muted);padding:3px}
.mclose:hover{color:var(--white)}

.empty{text-align:center;padding:36px 20px;color:var(--muted);font-size:14px}
.ms{background:rgba(56,160,255,.06);border-radius:8px;padding:8px 10px}
.msl{font-size:11px;color:var(--muted);margin-bottom:2px}
.msv{font-weight:700;color:var(--white);font-size:14px}
.ir{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
`;

// ─── PayBadge ────────────────────────────────────────────────────────────────
function PayBadge({ p }) {
  return <span className={`pay-badge ${payCls(p)}`}>{payLabel(p)}</span>;
}

// ─── Shared ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, icon, color }) {
  return (
    <div className="sc">
      <div className="sicon"><Icon d={icon} size={38} color={color}/></div>
      <div className="slabel">{label}</div>
      <div className="sval" style={{color}}>{value}</div>
      <div className="sunit">{unit}</div>
    </div>
  );
}
function MiniStat({ label, value }) {
  return <div className="ms"><div className="msl">{label}</div><div className="msv">{value}</div></div>;
}
function InfoRow({ label, value, accent }) {
  return (
    <div className="ir">
      <span style={{fontSize:13,color:"var(--muted)"}}>{label}</span>
      <span style={{fontWeight:600,color:accent||"var(--white)",fontSize:14}}>{value}</span>
    </div>
  );
}
function DeliveryTable({ rows }) {
  if (!rows.length) return <div className="empty">No delivery records found.</div>;
  return (
    <div className="tw">
      <table>
        <thead><tr><th>ID</th><th>Date</th><th>Boy</th><th>Customer</th><th>Qty</th><th>₹/G</th><th>Total</th><th>Payment</th><th>Note</th></tr></thead>
        <tbody>{[...rows].reverse().map(d=>(
          <tr key={d.id}>
            <td style={{fontSize:11,color:"var(--muted)",fontFamily:"monospace"}}>{d.id}</td>
            <td style={{fontSize:11,color:"var(--muted)"}}>{d.date}</td>
            <td><div style={{display:"flex",alignItems:"center",gap:6}}>
              <div className="av" style={{width:26,height:26,fontSize:10}}>{initials(d.deliveryBoy)}</div>{d.deliveryBoy}
            </div></td>
            <td style={{fontWeight:500,color:"var(--white)"}}>{d.customer}</td>
            <td>{d.qty}G</td><td>₹{d.price}</td>
            <td style={{fontWeight:600}}>₹{(d.qty*d.price).toLocaleString()}</td>
            <td><PayBadge p={d.payment}/></td>
            <td style={{fontSize:12,color:"var(--muted)"}}>{d.note||"—"}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ─── DuePayments ─────────────────────────────────────────────────────────────
function DuePayments({ data, persist }) {
  const dueList = data.deliveries.filter(d => d.payment === "due");
  const totalDue = dueList.reduce((s,d) => s + d.qty * d.price, 0);

  const markPaid = (id, method) => {
    const next = data.deliveries.map(d => d.id===id ? {...d, payment: method, paidAt: now()} : d);
    persist({...data, deliveries: next});
  };

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{display:"inline-block",background:"rgba(255,77,109,.1)",border:"1px solid rgba(255,77,109,.3)",borderRadius:14,padding:"14px 24px"}}>
          <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Total Due</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:30,fontWeight:800,color:"var(--danger)"}}>₹{totalDue.toLocaleString()}</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{dueList.length} pending {dueList.length===1?"order":"orders"}</div>
        </div>
      </div>
      <div className="card">
        <div className="ctitle">⏳ Pending Due Payments</div>
        {dueList.length===0
          ? <div className="empty">🎉 No pending dues! All payments cleared.</div>
          : <div className="tw">
              <table>
                <thead>
                  <tr><th>Date</th><th>Delivery Boy</th><th>Customer</th><th>Qty</th><th>Amount Due</th><th>Note</th><th>Mark as Paid</th></tr>
                </thead>
                <tbody>
                  {[...dueList].reverse().map(d=>(
                    <tr key={d.id}>
                      <td style={{fontSize:11,color:"var(--muted)"}}>{d.date}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div className="av" style={{width:26,height:26,fontSize:10}}>{initials(d.deliveryBoy)}</div>
                          {d.deliveryBoy}
                        </div>
                      </td>
                      <td style={{fontWeight:500,color:"var(--white)"}}>{d.customer}</td>
                      <td>{d.qty}G</td>
                      <td style={{fontWeight:700,color:"var(--danger)"}}>₹{(d.qty*d.price).toLocaleString()}</td>
                      <td style={{fontSize:12,color:"var(--muted)"}}>{d.note||"—"}</td>
                      <td>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <button className="btn btn-sm" style={{background:"rgba(0,212,138,.15)",color:"var(--success)",border:"1px solid rgba(0,212,138,.3)"}} onClick={()=>markPaid(d.id,"cash")}>💵 Cash</button>
                          <button className="btn btn-sm" style={{background:"rgba(167,139,250,.15)",color:"#a78bfa",border:"1px solid rgba(167,139,250,.3)"}} onClick={()=>markPaid(d.id,"upi")}>📱 UPI</button>
                          <button className="btn btn-sm" style={{background:"rgba(255,170,0,.15)",color:"var(--warning)",border:"1px solid rgba(255,170,0,.3)"}} onClick={()=>markPaid(d.id,"bank")}>🏦 Bank</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

// ─── UserManagement ───────────────────────────────────────────────────────────
function UserManagement({ data, persist, currentUsername }) {
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState({ username:"", name:"", role:"delivery", password:"", newPassword:"" });
  const [msg, setMsg]     = useState({ text:"", type:"" });

  const flash = (text, type="ok") => { setMsg({text,type}); setTimeout(()=>setMsg({text:"",type:""}),2600); };

  const openAdd = () => { setForm({ username:"", name:"", role:"delivery", password:"", newPassword:"" }); setModal({mode:"add"}); };
  const openEdit = (u) => { const x=data.users[u]; setForm({username:u,name:x.name||"",role:x.role,password:"",newPassword:""}); setModal({mode:"edit",username:u}); };
  const openCreds = (u) => { const x=data.users[u]; setForm({username:u,name:x.name||"",role:x.role,password:"",newPassword:""}); setModal({mode:"creds",username:u}); };

  const handleAdd = () => {
    if (!form.username.trim()) { flash("Username required.","err"); return; }
    if (data.users[form.username.trim()]) { flash("Username already exists.","err"); return; }
    if (!form.name.trim()) { flash("Display name required.","err"); return; }
    if (!form.password) { flash("Password required.","err"); return; }
    persist({...data, users:{...data.users,[form.username.trim()]:{role:form.role,name:form.name.trim(),password:form.password}}});
    flash(`"${form.name}" added!`); setModal(null);
  };
  const handleEdit = () => {
    if (!form.name.trim()) { flash("Name required.","err"); return; }
    persist({...data, users:{...data.users,[modal.username]:{...data.users[modal.username],name:form.name.trim(),role:form.role}}});
    flash("User updated!"); setModal(null);
  };
  const handleCreds = () => {
    if (!form.newPassword) { flash("New password required.","err"); return; }
    persist({...data, users:{...data.users,[modal.username]:{...data.users[modal.username],password:form.newPassword}}});
    flash("Password changed!"); setModal(null);
  };
  const handleDelete = (u) => {
    if (u===currentUsername) { flash("Cannot delete your own account.","err"); return; }
    if (!window.confirm(`Delete "${data.users[u].name}"?`)) return;
    const next={...data, users:{...data.users}}; delete next.users[u]; persist(next); flash("User deleted.");
  };

  const users = Object.entries(data.users);

  return (
    <div>
      {msg.text && <div className={msg.type==="err"?"err":"ok"} style={{marginBottom:14,fontSize:14}}>{msg.text}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div className="ctitle" style={{margin:0}}><Icon d={IC.user}/> User Accounts ({users.length})</div>
        <button className="btn btn-teal btn-sm" onClick={openAdd}><Icon d={IC.plus} size={14}/> Add User</button>
      </div>

      {["admin","manager","delivery"].map(role=>{
        const roleUsers = users.filter(([,v])=>v.role===role);
        if (!roleUsers.length) return null;
        return (
          <div key={role} style={{marginBottom:20}}>
            <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".1em",color:"var(--muted)",marginBottom:9,fontWeight:600}}>
              {role==="delivery"?"🚚 Delivery Boys":role==="manager"?"📦 Managers":"🔐 Admins"}
            </div>
            {roleUsers.map(([uname,u])=>(
              <div className="urow" key={uname}>
                <div className="av" style={{width:40,height:40,fontSize:14}}>{initials(u.name||uname)}</div>
                <div className="urow-info">
                  <div style={{fontWeight:600,color:"var(--white)",fontSize:14}}>{u.name||uname}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>@{uname}</div>
                </div>
                <span className={`rbadge r-${u.role}`}>{u.role}</span>
                <div className="urow-actions">
                  <button className="btn btn-warn btn-sm" onClick={()=>openEdit(uname)}><Icon d={IC.edit} size={13}/> Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>openCreds(uname)}><Icon d={IC.key} size={13}/> Pwd</button>
                  {uname!==currentUsername && u.role!=="admin" &&
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(uname)}><Icon d={IC.trash} size={13}/></button>}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {modal && (
        <div className="mo" onClick={()=>setModal(null)}>
          <div className="mb" onClick={e=>e.stopPropagation()}>
            <div className="mtitle">
              {modal.mode==="add"&&<><Icon d={IC.plus}/> Add New User</>}
              {modal.mode==="edit"&&<><Icon d={IC.edit}/> Edit User</>}
              {modal.mode==="creds"&&<><Icon d={IC.key}/> Change Password</>}
              <button className="mclose" onClick={()=>setModal(null)}><Icon d={IC.x} size={17}/></button>
            </div>
            {modal.mode==="add"&&<>
              <div className="frow" style={{gridTemplateColumns:"1fr 1fr"}}>
                <div className="field"><label>Username</label><input value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} placeholder="e.g. delivery4"/></div>
                <div className="field"><label>Role</label>
                  <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                    <option value="delivery">Delivery Boy</option><option value="manager">Manager</option><option value="admin">Admin</option>
                  </select></div>
              </div>
              <div className="field"><label>Display Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="Set password"/></div>
              <div className="fa"><button className="btn btn-teal" onClick={handleAdd}><Icon d={IC.check} size={14}/> Add User</button><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button></div>
            </>}
            {modal.mode==="edit"&&<>
              <div style={{marginBottom:13,padding:"9px 13px",background:"rgba(56,160,255,.07)",borderRadius:9,fontSize:13,color:"var(--muted)"}}>
                Editing: <span style={{color:"var(--white)",fontWeight:600}}>@{modal.username}</span>
              </div>
              <div className="field"><label>Display Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div>
              <div className="field"><label>Role</label>
                <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                  <option value="delivery">Delivery Boy</option><option value="manager">Manager</option><option value="admin">Admin</option>
                </select></div>
              <div className="fa"><button className="btn btn-primary" onClick={handleEdit}><Icon d={IC.check} size={14}/> Save</button><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button></div>
            </>}
            {modal.mode==="creds"&&<>
              <div style={{marginBottom:13,padding:"9px 13px",background:"rgba(255,170,0,.07)",borderRadius:9,fontSize:13,color:"var(--muted)"}}>
                Changing password for: <span style={{color:"var(--white)",fontWeight:600}}>{form.name} (@{modal.username})</span>
              </div>
              <div className="field"><label>New Password</label><input type="password" value={form.newPassword} onChange={e=>setForm(p=>({...p,newPassword:e.target.value}))} placeholder="Enter new password"/></div>
              <div className="fa"><button className="btn btn-warn" onClick={handleCreds}><Icon d={IC.key} size={14}/> Change</button><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button></div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ data, persist, session, onLogout }) {
  const [tab, setTab] = useState("overview");
  const { inventory, deliveries } = data;
  const totalRevenue = deliveries.reduce((s,d)=>d.payment!=="due"?s+(d.qty*d.price):s,0);
  const totalDue     = deliveries.filter(d=>d.payment==="due").reduce((s,d)=>s+(d.qty*d.price),0);
  const deliveryUsers = Object.entries(data.users).filter(([,v])=>v.role==="delivery");

  return (
    <div>
      <div className="ptitle"><Icon d={IC.admin} size={24} color="var(--warning)"/> Admin Dashboard</div>
      <div className="psub">Full control — operations, deliveries, inventory & user management</div>
      <div className="tabs">
        {[["overview","Overview"],["deliveries","Deliveries"],["inventory","Inventory"],["due","⏳ Due"],["users","👥 Users"]].map(([t,l])=>(
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>

      {tab==="overview"&&<>
        <div className="sgrid">
          <StatCard label="Stored"     value={inventory.stored}                   unit="Gallons"   icon={IC.bottle}   color="#38a0ff"/>
          <StatCard label="Sold"       value={inventory.sold}                     unit="Gallons"   icon={IC.chart}    color="#00e5c4"/>
          <StatCard label="Purchased"  value={inventory.bought}                   unit="Gallons"   icon={IC.box}      color="#ffaa00"/>
          <StatCard label="Revenue"    value={`₹${totalRevenue.toLocaleString()}`} unit="Collected" icon={IC.cash}    color="#00d48a"/>
          <StatCard label="Due Amount" value={`₹${totalDue.toLocaleString()}`}    unit="Pending"   icon={IC.card}     color="#ff4d6d"/>
          <StatCard label="Orders"     value={deliveries.length}                  unit="Total"     icon={IC.delivery} color="#a78bfa"/>
        </div>
        <div className="dcards">
          {deliveryUsers.map(([uname,u])=>{
            const mine=deliveries.filter(d=>d.deliveryBoy===u.name);
            const rev=mine.filter(d=>d.payment!=="due").reduce((s,d)=>s+(d.qty*d.price),0);
            return (
              <div className="dc" key={uname}>
                <div className="dch">
                  <div className="av" style={{width:38,height:38,fontSize:13}}>{initials(u.name)}</div>
                  <div><div className="dcn">{u.name}</div><div className="dcc">{mine.length} deliveries · @{uname}</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <MiniStat label="Qty" value={`${mine.reduce((s,d)=>s+d.qty,0)}G`}/>
                  <MiniStat label="Revenue" value={`₹${rev.toLocaleString()}`}/>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {tab==="deliveries"&&<div className="card"><div className="ctitle"><Icon d={IC.delivery}/>All Deliveries</div><DeliveryTable rows={deliveries}/></div>}

      {tab==="inventory"&&(
        <div className="sect2">
          <div className="card">
            <div className="ctitle"><Icon d={IC.box}/>Inventory Summary</div>
            <InfoRow label="Stored" value={`${inventory.stored} G`}/>
            <InfoRow label="Purchased" value={`${inventory.bought} G`}/>
            <InfoRow label="Sold" value={`${inventory.sold} G`}/>
          </div>
          <div className="card">
            <div className="ctitle"><Icon d={IC.history}/>Inventory Log</div>
            <div className="tw">
              {data.inventoryLog.length===0?<div className="empty">No entries</div>:
                <table><thead><tr><th>Date</th><th>Type</th><th>Qty</th><th>Note</th></tr></thead>
                  <tbody>{[...data.inventoryLog].reverse().map((l,i)=>(
                    <tr key={i}>
                      <td style={{fontSize:11,color:"var(--muted)"}}>{l.date}</td>
                      <td><span style={{color:l.type==="buy"?"var(--accent)":"var(--accent2)",fontWeight:600,fontSize:12}}>{l.type==="buy"?"📦 IN":"💧 OUT"}</span></td>
                      <td>{l.qty}G</td><td style={{color:"var(--muted)",fontSize:12}}>{l.note||"—"}</td>
                    </tr>
                  ))}</tbody>
                </table>}
            </div>
          </div>
        </div>
      )}

      {tab==="due"&&<DuePayments data={data} persist={persist}/>}
      {tab==="users"&&<UserManagement data={data} persist={persist} currentUsername={session.username}/>}
    </div>
  );
}

// ─── ManagerDashboard ─────────────────────────────────────────────────────────
function ManagerDashboard({ data, persist }) {
  const [tab, setTab] = useState("inventory");
  const [form, setForm] = useState({ type:"buy", qty:"", note:"" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const { inventory, inventoryLog, deliveries } = data;

  const handleSubmit = () => {
    if (!form.qty||isNaN(+form.qty)||+form.qty<=0){ setErr("Enter valid quantity."); return; }
    setErr(""); const qty=+form.qty;
    let next={...inventory};
    if (form.type==="buy"){next.bought+=qty;next.stored+=qty;}
    else{if(qty>next.stored){setErr("Not enough stock!");return;}next.sold+=qty;next.stored-=qty;}
    const log={id:uid(),date:now(),type:form.type,qty,note:form.note};
    persist({...data,inventory:next,inventoryLog:[...inventoryLog,log]});
    setForm({type:"buy",qty:"",note:""});
    setOk("Logged!"); setTimeout(()=>setOk(""),2000);
  };

  const totalRevenue=deliveries.reduce((s,d)=>d.payment!=="due"?s+(d.qty*d.price):s,0);
  const totalDue=deliveries.filter(d=>d.payment==="due").reduce((s,d)=>s+(d.qty*d.price),0);
  const deliveryUsers=Object.entries(data.users).filter(([,v])=>v.role==="delivery");

  return (
    <div>
      <div className="ptitle"><Icon d={IC.manager} size={24} color="var(--accent)"/> Manager Dashboard</div>
      <div className="psub">Manage factory stock, purchases and sales</div>
      <div className="tabs">
        {[["inventory","Inventory"],["deliveries","Deliveries"],["due","⏳ Due"],["reports","Reports"]].map(([t,l])=>(
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>

      {tab==="inventory"&&<>
        <div className="sgrid">
          <StatCard label="Stored"    value={inventory.stored} unit="Gallons" icon={IC.bottle} color="#38a0ff"/>
          <StatCard label="Purchased" value={inventory.bought} unit="Gallons" icon={IC.box}    color="#ffaa00"/>
          <StatCard label="Sold"      value={inventory.sold}  unit="Gallons" icon={IC.chart}  color="#00e5c4"/>
        </div>
        <div className="card">
          <div className="ctitle"><Icon d={IC.plus}/> Log Inventory Movement</div>
          <div className="frow">
            <div className="field"><label>Type</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                <option value="buy">Buy from Factory</option><option value="sell">Record Sale</option>
              </select></div>
            <div className="field"><label>Quantity (Gallons)</label><input type="number" value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))} placeholder="e.g. 50"/></div>
            <div className="field"><label>Note</label><input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder="Optional"/></div>
          </div>
          {err&&<div className="err">{err}</div>}{ok&&<div className="ok">{ok}</div>}
          <div className="fa"><button className="btn btn-primary" onClick={handleSubmit}><Icon d={IC.check} size={14}/> Log Entry</button></div>
        </div>
        <div className="card">
          <div className="ctitle"><Icon d={IC.history}/> History</div>
          <div className="tw">
            {inventoryLog.length===0?<div className="empty">No entries yet.</div>:
              <table><thead><tr><th>Date</th><th>Type</th><th>Qty</th><th>Note</th></tr></thead>
                <tbody>{[...inventoryLog].reverse().map(l=>(
                  <tr key={l.id}>
                    <td style={{fontSize:11,color:"var(--muted)"}}>{l.date}</td>
                    <td><span style={{color:l.type==="buy"?"var(--accent)":"var(--accent2)",fontWeight:600,fontSize:12}}>{l.type==="buy"?"📦 PURCHASED":"💧 SOLD"}</span></td>
                    <td style={{fontWeight:600}}>{l.qty}G</td><td style={{color:"var(--muted)",fontSize:12}}>{l.note||"—"}</td>
                  </tr>
                ))}</tbody>
              </table>}
          </div>
        </div>
      </>}

      {tab==="deliveries"&&<div className="card"><div className="ctitle"><Icon d={IC.delivery}/>All Deliveries</div><DeliveryTable rows={deliveries}/></div>}
      {tab==="due"&&<DuePayments data={data} persist={persist}/>}

      {tab==="reports"&&(
        <div className="sect2">
          <div className="card">
            <div className="ctitle"><Icon d={IC.chart}/> Financial Summary</div>
            <InfoRow label="Revenue Collected" value={`₹${totalRevenue.toLocaleString()}`} accent="var(--success)"/>
            <InfoRow label="Pending / Due"     value={`₹${totalDue.toLocaleString()}`}     accent="var(--danger)"/>
            <InfoRow label="Total Deliveries"  value={deliveries.length}/>
            <InfoRow label="💵 Cash"           value={deliveries.filter(d=>d.payment==="cash").length}/>
            <InfoRow label="📱 UPI / Online"   value={deliveries.filter(d=>d.payment==="upi").length}/>
            <InfoRow label="🏦 Bank Transfer"  value={deliveries.filter(d=>d.payment==="bank").length}/>
            <InfoRow label="💳 Card"           value={deliveries.filter(d=>d.payment==="card").length}/>
            <InfoRow label="⏳ Due"            value={deliveries.filter(d=>d.payment==="due").length} accent="var(--danger)"/>
          </div>
          <div className="card">
            <div className="ctitle"><Icon d={IC.delivery}/> Per-Boy Summary</div>
            {deliveryUsers.map(([uname,u])=>{
              const mine=deliveries.filter(d=>d.deliveryBoy===u.name);
              const rev=mine.filter(d=>d.payment!=="due").reduce((s,d)=>s+(d.qty*d.price),0);
              return (
                <div key={uname} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid var(--border)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                    <div className="av" style={{width:28,height:28,fontSize:10}}>{initials(u.name)}</div>
                    <span style={{fontWeight:600,color:"var(--white)",fontSize:14}}>{u.name}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
                    <MiniStat label="Orders" value={mine.length}/>
                    <MiniStat label="Qty"    value={`${mine.reduce((s,d)=>s+d.qty,0)}G`}/>
                    <MiniStat label="Revenue" value={`₹${rev.toLocaleString()}`}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DeliveryDashboard ────────────────────────────────────────────────────────
function DeliveryDashboard({ data, persist, session }) {
  const [form, setForm] = useState({ customer:"", qty:"", price:"", payment:"cash", note:"" });
  const [err, setErr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const myDeliveries = data.deliveries.filter(d=>d.deliveryBoy===session.name);
  const myRevenue    = myDeliveries.filter(d=>d.payment!=="due").reduce((s,d)=>s+(d.qty*d.price),0);
  const myDue        = myDeliveries.filter(d=>d.payment==="due").reduce((s,d)=>s+(d.qty*d.price),0);

  const handleLog = () => {
    if (!form.customer.trim())                         {setErr("Customer name required.");return;}
    if (!form.qty||isNaN(+form.qty)||+form.qty<=0)     {setErr("Enter valid quantity.");return;}
    if (!form.price||isNaN(+form.price)||+form.price<=0){setErr("Enter valid price.");return;}
    if (data.inventory.stored<+form.qty)               {setErr("Insufficient warehouse stock!");return;}
    setErr("");
    const entry={id:uid(),date:now(),deliveryBoy:session.name,customer:form.customer.trim(),qty:+form.qty,price:+form.price,payment:form.payment,note:form.note};
    const inv={...data.inventory,sold:data.inventory.sold+(+form.qty),stored:data.inventory.stored-(+form.qty)};
    persist({...data,deliveries:[...data.deliveries,entry],inventory:inv});
    setForm({customer:"",qty:"",price:"",payment:"cash",note:""});
    setSubmitted(true); setTimeout(()=>setSubmitted(false),2200);
  };

  return (
    <div>
      <div className="dmeta">
        <div className="av" style={{width:50,height:50,fontSize:17}}>{initials(session.name)}</div>
        <div><div className="dn">{session.name}</div><div className="dr">Delivery Boy · Water Business</div></div>
      </div>
      <div className="sgrid">
        <StatCard label="My Deliveries" value={myDeliveries.length}                    unit="Orders"    icon={IC.delivery} color="#00e5c4"/>
        <StatCard label="Qty Delivered"  value={myDeliveries.reduce((s,d)=>s+d.qty,0)} unit="Gallons"   icon={IC.bottle}   color="#38a0ff"/>
        <StatCard label="Revenue"        value={`₹${myRevenue.toLocaleString()}`}       unit="Collected" icon={IC.cash}     color="#00d48a"/>
        <StatCard label="Due Amount"     value={`₹${myDue.toLocaleString()}`}           unit="Pending"   icon={IC.card}     color="#ff4d6d"/>
      </div>
      <div className="sect2">
        <div className="card">
          <div className="ctitle"><Icon d={IC.plus}/> Log New Delivery</div>
          <div className="field"><label>Customer Name</label><input value={form.customer} onChange={e=>setForm(p=>({...p,customer:e.target.value}))} placeholder="Enter customer name"/></div>
          <div className="frow">
            <div className="field"><label>Quantity (Gallons)</label><input type="number" value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))} placeholder="e.g. 5"/></div>
            <div className="field"><label>Price / Gallon (₹)</label><input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} placeholder="e.g. 20"/></div>
          </div>
          <div className="field"><label>Payment Method</label>
            <select value={form.payment} onChange={e=>setForm(p=>({...p,payment:e.target.value}))}>
              <option value="cash">💵 Cash</option>
              <option value="upi">📱 UPI / Online</option>
              <option value="bank">🏦 Bank Transfer</option>
              <option value="card">💳 Card</option>
              <option value="due">⏳ Due (Pay Later)</option>
            </select>
          </div>
          <div className="field"><label>Note (optional)</label><input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} placeholder="Any remarks..."/></div>
          {err&&<div className="err">{err}</div>}
          {submitted&&<div className="ok">✅ Delivery logged!</div>}
          <div className="fa" style={{marginTop:10}}>
            <button className="btn btn-teal btn-full" onClick={handleLog}><Icon d={IC.check} size={14}/> Submit Delivery</button>
          </div>
          <div style={{marginTop:16,padding:"11px",background:"rgba(56,160,255,.06)",borderRadius:9,border:"1px solid var(--border)",fontSize:13}}>
            <div style={{color:"var(--muted)",marginBottom:3}}>Warehouse Stock Available</div>
            <div style={{color:"var(--white)",fontWeight:700,fontFamily:"'Syne',sans-serif",fontSize:22}}>{data.inventory.stored} Gallons</div>
          </div>
        </div>
        <div className="card">
          <div className="ctitle"><Icon d={IC.history}/> My Delivery History</div>
          <div className="tw">
            {myDeliveries.length===0?<div className="empty">No deliveries yet.<br/>Submit your first!</div>:
              <table><thead><tr><th>Customer</th><th>Qty</th><th>Amount</th><th>Payment</th><th>Date</th></tr></thead>
                <tbody>{[...myDeliveries].reverse().map(d=>(
                  <tr key={d.id}>
                    <td style={{fontWeight:500,color:"var(--white)"}}>{d.customer}</td>
                    <td>{d.qty}G</td>
                    <td>₹{(d.qty*d.price).toLocaleString()}</td>
                    <td><PayBadge p={d.payment}/></td>
                    <td style={{fontSize:11,color:"var(--muted)"}}>{d.date}</td>
                  </tr>
                ))}</tbody>
              </table>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(loadData);
  const [session, setSession] = useState(null);
  const [lf, setLf] = useState({ username:"", password:"" });
  const [lerr, setLerr] = useState("");

  const persist = (next) => { setData(next); saveData(next); };
  const handleLogin = () => {
    const u = data.users[lf.username.trim()];
    if (!u||u.password!==lf.password){ setLerr("Invalid username or password."); return; }
    setLerr(""); setSession({ username:lf.username.trim(), role:u.role, name:u.name||lf.username.trim() });
  };
  const handleLogout = () => { setSession(null); setLf({username:"",password:""}); };
  const sessionUser = session ? data.users[session.username] : null;
  const displayName = sessionUser?.name || session?.name || "";

  if (!session) return (
    <>
      <style>{CSS}</style>
      <div className="login-wrap">
        <div className="login-bg" style={{width:400,height:400,background:"#38a0ff",left:"-100px",top:"-100px"}}/>
        <div className="login-bg" style={{width:300,height:300,background:"#00e5c4",right:"-80px",bottom:"-80px"}}/>
        <div className="login-card">
          <div className="login-logo">
            <div className="lli"><Icon d={IC.bottle} size={22} color="#fff"/></div>
            <div><div className="lt">AquaBiz</div><div className="ls">Water Business Suite</div></div>
          </div>
          <div className="lh2">Welcome Back</div>
          <div className="ld">Sign in to continue to your dashboard</div>
          <div className="field"><label>Username</label>
            <input value={lf.username} onChange={e=>setLf(p=>({...p,username:e.target.value}))} placeholder="Enter your username" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
          <div className="field"><label>Password</label>
            <input type="password" value={lf.password} onChange={e=>setLf(p=>({...p,password:e.target.value}))} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
          {lerr&&<div className="err">{lerr}</div>}
          <button className="btn btn-primary btn-full" style={{marginTop:20}} onClick={handleLogin}>Sign In</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="hlogo">
            <div className="hli"><Icon d={IC.bottle} size={18} color="#fff"/></div>
            <span className="htitle">AquaBiz</span>
          </div>
          <div className="hright">
            <span className={`rbadge r-${session.role}`}>{session.role}</span>
            <span style={{fontSize:14,color:"var(--text)"}}>{displayName}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}><Icon d={IC.logout} size={14}/> Logout</button>
          </div>
        </header>
        <main className="main">
          {session.role==="admin"    && <AdminDashboard    data={data} persist={persist} session={session} onLogout={handleLogout}/>}
          {session.role==="manager"  && <ManagerDashboard  data={data} persist={persist}/>}
          {session.role==="delivery" && <DeliveryDashboard data={data} persist={persist} session={{...session,name:displayName}}/>}
        </main>
      </div>
    </>
  );
}
