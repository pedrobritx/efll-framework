import { createContext, useContext } from 'react';

// A single dialog lives at the app root; openModal(node, { title }) renders any
// content into it. Exposed via context so deep children (e.g. the homepage step
// tiles) can pop a modal without prop-drilling. The provider value is openModal.
export const ModalContext = createContext(null);

export function useModal() {
  return useContext(ModalContext);
}
