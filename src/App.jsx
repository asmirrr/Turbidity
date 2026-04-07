/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  X, 
  Maximize2, 
  ChevronLeft, 
  TrendingUp, 
  LayoutGrid,
  Info
} from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = ['All', ...Array.from(new Set(gamesData.map(g => g.category)))];

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <div className="p-2 bg-brand-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Unblocked<span className="text-brand-400">Games</span>
            </h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold mb-4 border border-brand-500/20">
                    NEW GAMES ADDED WEEKLY
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    Play Your Favorite Games <br />
                    <span className="text-brand-400">Anywhere, Anytime.</span>
                  </h2>
                  <p className="text-slate-400 text-lg mb-8">
                    Access a curated collection of unblocked browser games. No downloads, no blocks, just pure fun.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setSelectedCategory('Arcade')}
                      className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/20"
                    >
                      Explore Arcade
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('Puzzle')}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
                    >
                      Puzzle Games
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-l from-brand-500/40 to-transparent" />
                </div>
              </section>

              {/* Categories & Filter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <LayoutGrid className="w-4 h-4" />
                  <span>{filteredGames.length} Games Found</span>
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500/50 transition-all"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-1 rounded-md bg-brand-500/20 backdrop-blur-md text-brand-400 text-[10px] font-bold uppercase tracking-wider border border-brand-500/30">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-brand-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 bg-slate-900 rounded-full mb-4">
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No games found</h3>
                  <p className="text-slate-400">Try adjusting your search or category filters.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-[calc(100vh-10rem)]"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Games</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                />
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedGame.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-brand-400 text-sm font-medium">{selectedGame.category}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="text-slate-400 text-sm">{selectedGame.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Trending Now</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-brand-500 rounded-lg">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Unblocked<span className="text-brand-400">Games</span>
                </span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                The ultimate destination for unblocked browser games. Play the best games at school, work, or anywhere else.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors">
                  <span className="text-xs font-bold">TW</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors">
                  <span className="text-xs font-bold">DC</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Categories</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Arcade</li>
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Puzzle</li>
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Platformer</li>
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Classic</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-brand-400 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-brand-400 cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
            <p>© 2026 Unblocked Games Hub. All rights reserved.</p>
            <p>Made with ❤️ for gamers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
