export default function NotFound() {
    return (
      <div style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        background:"#F3F6FB", fontFamily:"Inter,system-ui,sans-serif",
        padding:24, textAlign:"center"
      }}>
        <div style={{
          width:56, height:56, borderRadius:14, background:"#2563EB",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 24px"
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <p style={{fontSize:72, fontWeight:800, color:"#1A202C", margin:"0 0 8px", lineHeight:1}}>404</p>
        <h1 style={{fontSize:22, fontWeight:700, color:"#1A202C", margin:"0 0 10px"}}>Page not found</h1>
        <p style={{color:"#718096", fontSize:15, maxWidth:320, lineHeight:1.6, margin:"0 0 32px"}}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" style={{
          background:"#2563EB", color:"white", border:"none", borderRadius:10,
          padding:"13px 28px", fontSize:15, fontWeight:600, cursor:"pointer",
          textDecoration:"none", display:"inline-block"
        }}>
          Back to WiseCard
        </a>
      </div>
    );
  }