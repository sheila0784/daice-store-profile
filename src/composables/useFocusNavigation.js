export function useFocusNavigation(refs) {
  function focusNext(refName) {
    const component = refs[refName]?.value;

    if (!component) return;

    const el =
      component.$el?.querySelector("input, button, textarea") ||
      component.$el ||
      component;

    el?.focus?.();
  }

  function focusNextSel(refName) {
    const component = refs[refName]?.value;

    if (!component) return;

    // 'input, button, [tabindex="0"]'
    if (component.$el) {
      const focusable = component.$el.querySelector(
        'input, button, textarea, [role="checkbox"]'
      );

      if (focusable) {
        focusable.focus();
        return;
      }
    }

    component.focus?.();
  }

  function focusNextButton(refName) {
    const component = refs[refName]?.value;

    if (!component) return;

    const root = component.$el || component;

    if (typeof root.focus === "function") {
      root.focus();
      return;
    }

    const focusable = root.querySelector?.(
      'input, button, textarea, [tabindex="0"]'
    );

    focusable?.focus();
  }

  return {
    focusNext,
    focusNextSel,
    focusNextButton,
  };
}