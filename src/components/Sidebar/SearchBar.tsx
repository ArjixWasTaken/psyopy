import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="p-3 border-b border-gray-700">
      <div className="relative">
        <input
          type="text"
          placeholder="Search connections..."
          className="w-full bg-gray-800 text-white px-3 py-2 rounded pl-9 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;