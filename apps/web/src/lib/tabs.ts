/**
 * Accessible client-side tabs. Tabs carry `data-<name>-tab="<id>"` and panels
 * carry `data-<name>-panel="<id>"` inside the same root element.
 */
export function initTabs(root: Element, name: string): void {
  const tabAttribute = `data-${name}-tab`;
  const panelAttribute = `data-${name}-panel`;
  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>(`[${tabAttribute}]`),
  );
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>(`[${panelAttribute}]`),
  );

  const activateTab = (activeTab: HTMLButtonElement, moveFocus = true) => {
    const activeId = activeTab.getAttribute(tabAttribute);

    tabs.forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute(panelAttribute) !== activeId;
    });

    if (moveFocus) activeTab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab, false));
    tab.addEventListener('keydown', (event) => {
      let nextIndex: number | undefined;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft')
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      activateTab(tabs[nextIndex]);
    });
  });
}
