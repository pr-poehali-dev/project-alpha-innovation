import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import api, { type VideoProject, type GeneratedScript } from '@/lib/api';

const AVATARS: Record<string, { emoji: string; color: string }> = {
  alice: { emoji: '👩‍💼', color: '#a855f7' },
  max: { emoji: '👨‍💻', color: '#3b82f6' },
  sofia: { emoji: '👩‍🏫', color: '#ec4899' },
  artem: { emoji: '🧑‍🎤', color: '#f59e0b' },
  victoria: { emoji: '📰', color: '#22c55e' },
};

const PLATFORM_NAMES: Record<string, string> = {
  reels: 'Instagram Reels',
  tiktok: 'TikTok',
  shorts: 'YouTube Shorts',
  stories: 'Stories',
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewProject, setViewProject] = useState<VideoProject | null>(null);
  const [viewScript, setViewScript] = useState<GeneratedScript | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeViewScene, setActiveViewScene] = useState(0);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот проект?')) return;
    setDeletingId(id);
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (viewProject?.id === id) setViewProject(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Ошибка удаления');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (project: VideoProject) => {
    setViewProject(project);
    setActiveViewScene(0);
    try {
      const parsed = JSON.parse(project.script);
      setViewScript(parsed);
    } catch {
      setViewScript(null);
    }
  };

  const getAvatar = (id: string) => AVATARS[id] || { emoji: '🤖', color: '#6b7280' };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={20} />
            <span className="font-medium">VibeFactory</span>
          </button>
          <h1 className="font-semibold text-foreground">Мои проекты</h1>
          <button onClick={() => navigate('/create')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
            <Icon name="Plus" size={16} />
            Новое видео
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">Загружаю проекты...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <Icon name="AlertTriangle" size={40} className="mx-auto text-destructive mb-4" />
            <p className="text-muted-foreground">{error}</p>
            <button onClick={loadProjects} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground">Повторить</button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Icon name="Video" size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Пока нет проектов</h2>
            <p className="text-muted-foreground mb-6">Создайте первое видео — это займёт меньше 5 минут</p>
            <button onClick={() => navigate('/create')} className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
              <Icon name="Plus" size={20} />
              Создать видео
            </button>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const av = getAvatar(project.avatar_id);
              const isDeleting = deletingId === project.id;

              return (
                <div
                  key={project.id}
                  className={`group relative rounded-2xl border border-border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer ${isDeleting ? 'opacity-50' : ''}`}
                  onClick={() => handleView(project)}
                >
                  <div className="aspect-video relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${av.color}15, ${av.color}05)` }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl" style={{ filter: `drop-shadow(0 0 15px ${av.color})` }}>{av.emoji}</span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: av.color + '20', color: av.color }}>
                      {PLATFORM_NAMES[project.platform] || project.platform}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/60 text-white text-[10px]">
                      {project.duration_sec} сек
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground truncate mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{project.topic}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{formatDate(project.created_at)}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                          className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                        >
                          <Icon name="Trash2" size={14} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {viewProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewProject(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-3xl shadow-2xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewProject(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center z-10">
              <Icon name="X" size={18} />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{getAvatar(viewProject.avatar_id).emoji}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{viewProject.title}</h2>
                  <p className="text-muted-foreground">{viewProject.avatar_name} | {PLATFORM_NAMES[viewProject.platform]} | {viewProject.duration_sec} сек</p>
                </div>
              </div>

              {viewScript ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-sm font-medium text-primary mb-1">Крючок</div>
                    <p className="text-foreground">{viewScript.hook}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Сценарий</h3>
                    {viewScript.scenes.map((scene, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          i === activeViewScene ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => setActiveViewScene(i)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted">{scene.time}</span>
                          <span className="text-xs text-muted-foreground">{scene.emotion}</span>
                        </div>
                        <p className="text-sm text-foreground mb-1">{scene.text}</p>
                        <p className="text-xs text-muted-foreground">{scene.visual}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="text-sm font-medium mb-1">Призыв к действию</div>
                    <p className="text-sm text-muted-foreground">{viewScript.cta}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {viewScript.hashtags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">#{tag}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Сценарий не найден</p>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    if (viewScript) {
                      const text = viewScript.scenes.map(s => `[${s.time}] ${s.text}`).join('\n\n');
                      navigator.clipboard.writeText(`${viewScript.title}\n\n${viewScript.hook}\n\n${text}\n\n${viewScript.cta}\n\n${viewScript.hashtags.map(t => '#' + t).join(' ')}`);
                      alert('Сценарий скопирован!');
                    }
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="Copy" size={18} />
                  Скопировать сценарий
                </button>
                <button
                  onClick={() => handleDelete(viewProject.id)}
                  className="px-6 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                >
                  <Icon name="Trash2" size={18} />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
