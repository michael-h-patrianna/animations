import { CodeIcon } from '@/components/ui/icons/CodeIcon'
import { LinkIcon } from '@/components/ui/icons/LinkIcon'
import { MonitorIcon } from '@/components/ui/icons/MonitorIcon'
import { SmartphoneIcon } from '@/components/ui/icons/SmartphoneIcon'
import { ChevronDown } from '@/components/ui/icons/ChevronDown'

// ── Description ───────────────────────────────────────────────────────────

type DescriptionProps = {
  description: string
  isExpanded: boolean
  onToggle: () => void
}

/** Collapsible description text with a chevron toggle. */
export const Description = ({ description, isExpanded, onToggle }: DescriptionProps) => (
  <div className="flex items-start gap-2">
    <p
      className={`pf-card__description flex-1 m-0 transition-all duration-200 ${!isExpanded ? 'line-clamp-1' : ''}`}
      data-testid="card-description"
      data-expanded={isExpanded || undefined}
    >
      {description}
    </p>
    <button
      type="button"
      onClick={onToggle}
      className="shrink-0 p-0 bg-transparent border-none cursor-pointer focus:outline-none mt-1"
      aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
      data-testid="description-toggle"
    >
      <ChevronDown
        className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-(--text-secondary)/60`}
      />
    </button>
  </div>
)

// ── Header Action Buttons ─────────────────────────────────────────────────

type HeaderActionsProps = {
  onCopyLink: () => void
  onOpenCode?: () => void
  onOpenDesktopPreview: () => void
  onOpenMobilePreview: () => void
}

/** Row of icon buttons: preview, code, link. */
const HeaderActions = ({
  onCopyLink,
  onOpenCode,
  onOpenDesktopPreview,
  onOpenMobilePreview,
}: HeaderActionsProps) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      className="pf-card__code-btn"
      onClick={onOpenDesktopPreview}
      aria-label="Desktop preview"
      title="Desktop preview"
      data-testid="preview-btn-desktop"
    >
      <MonitorIcon />
    </button>
    <button
      type="button"
      className="pf-card__code-btn"
      onClick={onOpenMobilePreview}
      aria-label="Mobile preview"
      title="Mobile preview"
      data-testid="preview-btn-mobile"
    >
      <SmartphoneIcon />
    </button>
    {onOpenCode != null && (
      <button
        type="button"
        className="pf-card__code-btn"
        onClick={onOpenCode}
        aria-label="View source code"
        title="View source code"
        data-testid="code-viewer-btn"
      >
        <CodeIcon />
      </button>
    )}
    <button
      type="button"
      className="pf-card__code-btn"
      onClick={onCopyLink}
      aria-label="Copy animation URL"
      title="Copy animation URL"
      data-testid="copy-link-btn"
    >
      <LinkIcon />
    </button>
  </div>
)

// ── Card Header Bar ───────────────────────────────────────────────────────

type CardHeaderBarProps = HeaderActionsProps & {
  title: string
  isExpanded: boolean
  description: string
  onToggle: () => void
}

/** Card header with title, action buttons, and collapsible description. */
export const CardHeaderBar = ({
  title,
  isExpanded,
  description,
  onToggle,
  ...actions
}: CardHeaderBarProps) => (
  <div className="p-0 pb-3">
    <div className="flex items-center justify-between gap-2">
      <div
        className="pf-card__title mb-0 font-semibold leading-none tracking-tight"
        data-testid="card-title"
      >
        {title}
      </div>
      <HeaderActions {...actions} />
    </div>
    <Description description={description} isExpanded={isExpanded} onToggle={onToggle} />
  </div>
)
