function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-8">
        {children}
      </div>
    </div>
  );
}

export default Layout;