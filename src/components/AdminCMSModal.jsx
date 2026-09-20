import React, { useState } from 'react';

export default function AdminCMSModal({
  isOpen,
  onClose,
  projects,
  onSaveProjects,
  onResetProjects,
}) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: 'Commercial & Corporate',
    sector: 'Commercial',
    location: 'Dubai, UAE',
    year: '2024',
    primaryImage: '',
    details: '',
    services: 'Structural Design, Authority AoR Clearances',
    featured: false,
  });

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectToEdit = (proj) => {
    setSelectedProjectId(proj.id);
    setIsEditing(true);
    setFormData({
      title: proj.title || '',
      client: proj.client || '',
      category: proj.category || 'Commercial & Corporate',
      sector: proj.sector || 'Commercial',
      location: proj.location || 'Dubai, UAE',
      year: proj.year || '2024',
      primaryImage: proj.primaryImage || '',
      details: proj.details || '',
      services: Array.isArray(proj.services) ? proj.services.join(', ') : proj.services || '',
      featured: !!proj.featured,
    });
  };

  const handleCreateNew = () => {
    setSelectedProjectId(null);
    setIsEditing(true);
    setFormData({
      title: '',
      client: 'Private Client',
      category: 'High-Rise & Towers',
      sector: 'Commercial Towers',
      location: 'Dubai, UAE',
      year: '2025',
      primaryImage: '/images/hero-bridge.jpg',
      details: 'Structural design and engineering consultancy.',
      services: 'Structural Design, BIM Level 3',
      featured: false,
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const servicesArray = formData.services
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (selectedProjectId) {
      // Update existing
      const updated = projects.map((p) => {
        if (p.id === selectedProjectId) {
          return {
            ...p,
            ...formData,
            services: servicesArray,
            gallery: p.gallery && p.gallery.length > 0 ? p.gallery : [formData.primaryImage],
          };
        }
        return p;
      });
      onSaveProjects(updated);
      setFeedback('Project updated successfully!');
    } else {
      // Add new
      const newId = `proj-${Date.now()}`;
      const newProj = {
        id: newId,
        slNo: projects.length + 1,
        ...formData,
        services: servicesArray,
        gallery: [formData.primaryImage],
      };
      const updated = [newProj, ...projects];
      onSaveProjects(updated);
      setFeedback('New project added to portfolio!');
    }

    setTimeout(() => setFeedback(''), 3000);
    setIsEditing(false);
    setSelectedProjectId(null);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project from the live portfolio?')) {
      const updated = projects.filter((p) => p.id !== id);
      onSaveProjects(updated);
      setFeedback('Project removed.');
      setTimeout(() => setFeedback(''), 3000);
      if (selectedProjectId === id) {
        setIsEditing(false);
        setSelectedProjectId(null);
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `core_consult_projects_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setFeedback('Exported full database to JSON!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          onSaveProjects(imported);
          setFeedback(`Successfully imported ${imported.length} projects!`);
          setTimeout(() => setFeedback(''), 3000);
        } else {
          alert('Invalid JSON structure: Expected an array of project objects.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#08184E]/40 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto glass-modal rounded-3xl text-[#08184E] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 glass-panel-subtle border-b border-white/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg glass-badge flex items-center justify-center text-gold-700">
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            </div>
            <div>
              <span className="font-serif text-base font-bold text-[#08184E] block">
                Bureau of Engineering Studies (BEST) CMS — Portfolio & Project Manager
              </span>
              <span className="font-sans text-[10px] text-steel-600">
                Independent client-side content editor with live browser persistence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-badge hover:bg-white/60 text-xs font-sans text-gold-800 font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export JSON</span>
            </button>

            <label className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-badge hover:bg-white/60 text-xs font-sans text-[#08184E] cursor-pointer font-medium transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">upload</span>
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-steel-600 hover:text-[#08184E] hover:bg-white/60 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="px-6 py-2 bg-emerald-50/90 border-b border-emerald-500/30 text-emerald-800 text-xs font-sans font-bold text-center">
            ✓ {feedback}
          </div>
        )}

        {/* Content Body Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto">
          {/* Left Column: Project Catalog */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-steel-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 glass-input rounded-xl text-xs placeholder-steel-400 font-sans"
                />
              </div>

              <button
                onClick={handleCreateNew}
                className="px-3.5 py-2 rounded-xl bg-[#08184E] hover:bg-[#0c226b] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md shrink-0 transition-all"
              >
                <span className="material-symbols-outlined text-sm text-gold-400">add</span>
                <span>New Project</span>
              </button>
            </div>

            <div className="text-[11px] font-sans text-steel-600 flex justify-between px-1 font-medium">
              <span>Catalog: {projects.length} Total Projects</span>
              <span>Showing: {filteredProjects.length}</span>
            </div>

            {/* Project List */}
            <div className="space-y-2 max-h-[56vh] overflow-y-auto pr-1">
              {filteredProjects.map((p) => {
                const isSelected = selectedProjectId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectToEdit(p)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                      isSelected
                        ? 'bg-[#08184E] border-[#08184E] text-white font-semibold shadow-md'
                        : 'glass-card text-steel-800 hover:text-[#08184E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.primaryImage}
                        alt=""
                        className="w-12 h-10 object-cover rounded-lg shrink-0 border border-white/60"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero-bridge.jpg';
                        }}
                      />
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#08184E]'}`}>{p.title}</div>
                        <div className={`text-[10px] font-sans truncate ${isSelected ? 'text-steel-200' : 'text-steel-500'}`}>
                          {p.category} · {p.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(p.id);
                        }}
                        className={`p-1 rounded transition-colors ${isSelected ? 'text-steel-200 hover:text-red-300' : 'text-steel-400 hover:text-red-600'}`}
                        title="Delete project"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Project Edit / Creation Form */}
          <div className="lg:col-span-7 p-6 rounded-2xl glass-panel space-y-4 shadow-sm">
            {isEditing ? (
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/50">
                  <h3 className="font-serif text-base font-bold text-[#08184E]">
                    {selectedProjectId ? 'Edit Project Details' : 'Add New Project to Portfolio'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedProjectId(null);
                    }}
                    className="text-xs font-sans text-steel-500 hover:text-[#08184E] font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 glass-input rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                      Client / Developer Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full p-2.5 glass-input rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 glass-input rounded-lg text-xs"
                    >
                      <option value="High-Rise & Towers">High-Rise & Towers</option>
                      <option value="Luxury Residential & Villas">Luxury Residential & Villas</option>
                      <option value="Hospitality & Hotels">Hospitality & Hotels</option>
                      <option value="Commercial & Corporate">Commercial & Corporate</option>
                      <option value="Aviation & Hangars">Aviation & Hangars</option>
                      <option value="Educational & Institutional">Educational & Institutional</option>
                      <option value="Industrial & Manufacturing">Industrial & Manufacturing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-2.5 glass-input rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                      Year *
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full p-2.5 glass-input rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                    Primary Image URL / Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryImage}
                    onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                    className="w-full p-2.5 glass-input rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                    Services Rendered (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    placeholder="Structural Design, Value Engineering, BIM Level 3"
                    className="w-full p-2.5 glass-input rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-sans uppercase text-[#08184E] font-semibold">
                    Technical Specifications / Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full p-2.5 glass-input rounded-lg text-xs resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded accent-[#08184E]"
                  />
                  <label htmlFor="featured" className="text-xs text-[#08184E] font-medium">
                    Feature on Homepage Showcase
                  </label>
                </div>

                <div className="pt-4 border-t border-white/50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-sans text-steel-500 hover:text-[#08184E] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#08184E] hover:bg-[#0c226b] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                  >
                    {selectedProjectId ? 'Save Changes' : 'Add Project'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full glass-badge flex items-center justify-center text-gold-700">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#08184E]">
                    Select a Project to Edit
                  </h4>
                  <p className="text-xs text-steel-600 max-w-sm mt-1 font-sans">
                    Select any project from the catalog on the left to edit its parameters, or click "New Project" to add a new development.
                  </p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-2.5 rounded-xl bg-[#08184E] hover:bg-[#0c226b] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Create New Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Reset Strip */}
        <div className="px-6 py-3 glass-panel-subtle border-t border-white/60 flex items-center justify-between text-xs font-sans text-steel-600">
          <span>All edits save instantly to localStorage</span>
          <button
            onClick={() => {
              if (window.confirm('Reset all projects to factory default?')) {
                onResetProjects();
                setFeedback('Reset to default dataset.');
                setTimeout(() => setFeedback(''), 3000);
              }
            }}
            className="text-red-600 hover:text-red-700 underline font-semibold"
          >
            Reset to Original Data
          </button>
        </div>
      </div>
    </div>
  );
}
