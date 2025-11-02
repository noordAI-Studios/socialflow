// src/components/Header.jsx
import React from 'react';
import { Plus, Download, Moon, Sun, Search, Calendar, Grid } from 'lucide-react';
import { PLATFORMS, STATUSES } from '../utils/constants';
import Button from '../shared/components/Button';

export const Header = ({
  darkMode,
  setDarkMode,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterPlatform,
  setFilterPlatform,
  sortBy,
  setSortBy,
  onExport,
  onNewPost
}) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${cardBg} border-b ${borderClass} sticky top-0 z-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-semibold ${textClass}`}>
            Gestionnaire Social Media
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-opacity ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : `${inputBg} hover:opacity-80`
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-opacity ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : `${inputBg} hover:opacity-80`
              }`}
            >
              <Calendar size={20} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${inputBg} hover:opacity-80 transition-opacity`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Rechercher un post..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">Tous les statuts</option>
            {STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">Toutes les plateformes</option>
            {PLATFORMS.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>

          {viewMode === 'grid' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="date">Trier par date</option>
              <option value="title">Trier par titre</option>
              <option value="status">Trier par statut</option>
            </select>
          )}

        <Button onClick={onNewPost} variant="normal"><span>Créer un nouveau post</span></Button>
        </div>
      </div>
    </div>
  );
};