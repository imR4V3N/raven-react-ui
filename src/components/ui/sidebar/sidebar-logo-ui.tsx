import type { SidebarLogoType } from "../../types/sidebar/sidebar-logo-type";

export function SidebarLogoUI({ element }: { element: SidebarLogoType }) {
  const getTextSize = (titleLength: number): string => {
    if (titleLength <= 5) return "text-2xl";
    if (titleLength <= 10) return "text-xl";
    if (titleLength <= 15) return "text-lg";
    return "text-base";
  };

  return (
      <a href={element.link} className="sidebar-logo-ui flex items-center gap-3">
          <div
              className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-gray-300 flex-shrink-0"
              style={{ background: "var(--accent-bg)" }}
          >
              {element.logo ? (
                  <img src={element.logo} alt={element.title} className="object-contain" />
              ) : (
                  <div className="w-8 h-8 bg-[color:var(--accent)] rounded" />
              )}
          </div>

          <div className="flex-1 min-w-0">
              <h1 className={`${getTextSize(element.title.length)} font-bold truncate`} style={{ color: "var(--text-h)" }}>
                  {element.title}
              </h1>
          </div>
      </a>
  );
}
