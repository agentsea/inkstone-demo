/**
 * FakeSidebar — Collapsible left sidebar matching Inkstone's doc explorer.
 *
 * Collapsed: narrow strip with logo icon only.
 * Open: project tree with documents, web searches, research.
 * Opens at Step 13 of the guided tour — the "nothing gets lost" moment.
 */

import {
  Home,
  Search,
  FolderOpen,
  FilePen,
  Globe,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SIDEBAR } from "../data/walkthrough-script";
import "./fake-sidebar.css";

interface FakeSidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

const ICON_MAP = {
  file: FileText,
  search: Globe,
  research: BookOpen,
} as const;

export function FakeSidebar({ isOpen, onToggle }: FakeSidebarProps) {
  return (
    <div
      className={`fake-sidebar ${isOpen ? "fake-sidebar--open" : "fake-sidebar--collapsed"}`}
      data-tour-target="sidebar"
    >
      {/* Collapsed state: icon column */}
      {!isOpen && (
        <div className="fake-sidebar__collapsed">
          <div className="fake-sidebar__logo">
            <span className="fake-sidebar__logo-icon">I</span>
          </div>
          <button className="fake-sidebar__icon-btn" title="Home">
            <Home size={16} />
          </button>
          <button className="fake-sidebar__icon-btn" title="Search">
            <Search size={16} />
          </button>
          <button
            className="fake-sidebar__icon-btn fake-sidebar__expand-btn"
            onClick={onToggle}
            title="Expand sidebar"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      )}

      {/* Open state: full project tree */}
      {isOpen && (
        <div className="fake-sidebar__expanded">
          {/* Header */}
          <div className="fake-sidebar__header">
            <div className="fake-sidebar__header-row">
              <span className="fake-sidebar__logo-icon">I</span>
              <span className="fake-sidebar__brand">Inkstone</span>
              <button className="fake-sidebar__collapse-btn" onClick={onToggle}>
                <ChevronsLeft size={14} />
              </button>
            </div>
            <div className="fake-sidebar__actions">
              <button className="fake-sidebar__action-btn">
                <Home size={14} />
                <span>Home</span>
              </button>
              <button className="fake-sidebar__action-btn">
                <Search size={14} />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Create project button */}
          <div className="fake-sidebar__create">
            <button className="fake-sidebar__create-btn">
              <FilePen size={14} />
              <span>Create Project</span>
            </button>
          </div>

          {/* Project tree */}
          <div className="fake-sidebar__tree">
            <div className="fake-sidebar__project">
              <div className="fake-sidebar__project-header">
                <ChevronDown size={14} />
                <FolderOpen size={14} />
                <span className="fake-sidebar__project-name">{SIDEBAR.projectName}</span>
              </div>
              <div className="fake-sidebar__doc-list">
                {SIDEBAR.documents.map((doc, i) => {
                  const Icon = ICON_MAP[doc.icon];
                  return (
                    <div
                      key={i}
                      className={`fake-sidebar__doc ${doc.active ? "fake-sidebar__doc--active" : ""}`}
                    >
                      <Icon size={14} />
                      <span className="fake-sidebar__doc-name">{doc.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
