"""Apply the V8.10 admin route guards to the existing BSU branch. Idempotent."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def patch(path: str, old: str, new: str) -> None:
    target = ROOT / path
    content = target.read_text(encoding="utf-8-sig")
    if new in content:
        print(f"SKIP already patched: {path}")
        return
    if old not in content:
        raise RuntimeError(f"Unexpected source in {path}; did not alter file")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")
    print(f"PATCHED {path}")


patch("src/app/admin/page.tsx",
      'import type { Metadata } from "next";',
      'import type { Metadata } from "next";\nimport { requireAdminRole } from "@/lib/admin-session";')
patch("src/app/admin/page.tsx",
      '  // Preview only. Data comes from local snapshots, not PostgreSQL or Backend API.',
      '  await requireAdminRole("ccr");\n\n  // Preview only. Data comes from local snapshots, not PostgreSQL or Backend API.')

for role in ("faculty", "department", "review"):
    path = f"src/app/admin/{role}/page.tsx"
    target = ROOT / path
    text = target.read_text(encoding="utf-8-sig")
    expected = 'import EditorialDemo from "@/components/admin/EditorialDemo";'
    if 'requireAdminRole' not in text:
        if expected not in text: raise RuntimeError(f"Unexpected {path}")
        text = text.replace(expected, expected+'\nimport { requireAdminRole } from "@/lib/admin-session";', 1)
    fn = f'export default function { {"faculty":"FacultyAdminPage","department":"DepartmentAdminPage","review":"CCRReviewPage"}[role]}()'
    if fn in text: text = text.replace(fn, fn.replace("function", "async function"), 1)
    elif "export default async function" not in text: raise RuntimeError(f"Unexpected function in {path}")
    if role == "review":
        old = '  return <EditorialDemo role="review" />;'
        new = '  await requireAdminRole("ccr");\n  return <EditorialDemo role="review" />;'
    else:
        old = f'  return <EditorialDemo role="{role}" />;'
        slug = 'facultySlug' if role == 'faculty' else 'departmentSlug'
        new = f'  const principal = await requireAdminRole("{role}");\n  return <EditorialDemo role="{role}" lockedSlug={{principal.{slug} ?? ""}} />;'
    if old in text: text = text.replace(old,new,1)
    elif new not in text: raise RuntimeError(f"Unexpected JSX in {path}")
    target.write_text(text, encoding="utf-8")
    print(f"PATCHED {path}")

path="src/components/admin/EditorialDemo.tsx"
patch(path, 'export default function EditorialDemo({ role }: { role: Mode }) {',
      'export default function EditorialDemo({ role, lockedSlug }: { role: Mode; lockedSlug?: string }) {')
patch(path, 'const [selectedSlug, setSelectedSlug] = useState("");',
      'const [selectedSlug, setSelectedSlug] = useState(lockedSlug ?? "");')
patch(path, '  function selectUnit(slug: string) {',
      '  function selectUnit(slug: string) {\n    if (lockedSlug) return;')
patch(path, '          {!reviewMode && <section className={card}>',
      '          {!reviewMode && !lockedSlug && <section className={card}>')
patch(path, 'Прототип без авторизации. Выбор подразделения не предоставляет реальных прав. Данные находятся в localStorage этого браузера и не передаются в PostgreSQL. Не вводите конфиденциальную информацию.',
      'Вход подтверждён через тестовый Backend. Формы и новости пока демонстрационные: данные находятся в localStorage и не передаются в PostgreSQL. Настоящая защита редактирования потребует серверных API.')
print('PASS V8.10: login guards installed; no backend writes')
