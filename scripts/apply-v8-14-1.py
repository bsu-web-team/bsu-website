"""Apply safe, exact string edits after extracting this archive in repo root."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]

def patch(path, old, new):
    p = root / path
    if not p.is_file(): raise SystemExit(f'MISSING {path}')
    content = p.read_text(encoding='utf-8-sig')
    if new and new in content:
        print(f'ALREADY {path}')
        return
    if old not in content: raise SystemExit(f'EXPECTED TEXT NOT FOUND in {path}: {old[:85]!r}')
    content = content.replace(old, new, 1)
    p.write_text(content, encoding='utf-8')
    print(f'PATCHED {path}')

patch('backend/app/main.py',
      'from . import admin_router, editorial_router, media_router',
      'from . import admin_router, editorial_router, media_router, unit_profile_router')
patch('backend/app/main.py',
      'app.include_router(media_router.router, prefix=API_PREFIX)',
      'app.include_router(media_router.router, prefix=API_PREFIX)\napp.include_router(unit_profile_router.router, prefix=API_PREFIX)')
patch('backend/alembic/env.py',
      'from app import editorial_media  # noqa: F401',
      'from app import editorial_media  # noqa: F401\nfrom app import unit_profile_models  # noqa: F401')

p = 'src/components/admin/EditorialDemo.tsx'
patch(p, 'const [notice, setNotice] = useState("");',
      'const [notice, setNotice] = useState("");\n  const [profileBusy, setProfileBusy] = useState(false);\n  const [profileStatus, setProfileStatus] = useState("");')
# Read server profile on mount for signed-in faculty/department only.
needle = '  const unit = units.find((u) => u.slug === selectedSlug);'
replacement = '''  useEffect(() => {
    if (role === "review" || !lockedSlug) return;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/admin-unit-profile", { cache: "no-store" });
        const value: { description?: string; contact?: string; status?: string; detail?: string } = await response.json();
        if (!response.ok) throw new Error(value.detail || `HTTP ${response.status}`);
        setDescription(value.description ?? "");
        setContact(value.contact ?? "");
        setProfileStatus(value.status ?? "empty");
      } catch (e) { setNotice(e instanceof Error ? e.message : "Ошибка загрузки профиля"); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [lockedSlug, role]);

  const unit = units.find((u) => u.slug === selectedSlug);'''
patch(p,needle,replacement)
old = '''  function saveProfile() {
    if (!unit) return;
    const next = { ...profiles, [profileKey]: { description: description.trim(), contact: contact.trim() } };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); setProfiles(next); setNotice("Описание подразделения сохранено только в этом браузере."); }
    catch { setNotice("Не удалось сохранить демо-профиль."); }
  }'''
new = '''  async function saveProfile() {
    if (!unit || !lockedSlug || profileBusy) return;
    setProfileBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin-unit-profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), contact: contact.trim() }),
      });
      const value: { status?: string; detail?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(value.detail || value.error || `HTTP ${response.status}`);
      setProfileStatus(value.status ?? "draft");
      setNotice("Черновик профиля сохранён в тестовой PostgreSQL. Публичная страница не изменена.");
    } catch (e) { setNotice(e instanceof Error ? e.message : "Не удалось сохранить профиль"); }
    finally { setProfileBusy(false); }
  }'''
patch(p,old,new)
patch(p,'  const profileKey = `${role}:${selectedSlug}`;\n','')
patch(p,
      '<p>Вход подтверждён через тестовый Backend. Формы и новости пока демонстрационные: данные находятся в localStorage и не передаются в PostgreSQL. Настоящая защита редактирования потребует серверных API.</p>',
      '<p>Профиль подразделения сохраняется как закрытый черновик в тестовой PostgreSQL. Раздел новостей ниже пока демонстрационный (localStorage). Публичные страницы не изменяются.</p>')
patch(p,
      '<p className="mt-1 text-sm text-slate-500">Демонстрационная форма; не меняет публичную страницу.</p>',
      '<p className="mt-1 text-sm text-slate-500">Сохраняется в тестовой PostgreSQL без публичной публикации. Статус: {profileStatus === "draft" ? "черновик" : "не заполнено"}.</p>')
patch(p,
      '<button type="button" className={primary} onClick={saveProfile}><Save size={17}/> Сохранить демо-профиль</button>',
      '<button type="button" className={primary} disabled={profileBusy} onClick={()=>void saveProfile()}><Save size={17}/> {profileBusy ? "Сохранение…" : "Сохранить черновик в PostgreSQL"}</button>')
print('V8.14.1 patch complete. Public backend contract unchanged; no database migrated yet.')
