import React from 'react'

const ElectionDetails = () => {
  return (
    <section className="flex min-h-screen">
      {/* Sidebar stays on the left */}
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content next to the sidebar */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8"></header>
      </div>
    </section>
  )
}

export default ElectionDetails