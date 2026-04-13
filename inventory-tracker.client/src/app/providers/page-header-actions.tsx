/* eslint-disable react-refresh/only-export-components, react-hooks/exhaustive-deps */
import {
  createContext,
  type DependencyList,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const PageHeaderActionsContext = createContext<ReactNode>(null);
const PageHeaderActionsSetterContext = createContext<
  ((actions: ReactNode) => void) | null
>(null);

export function PageHeaderActionsProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<ReactNode>(null);

  return (
    <PageHeaderActionsSetterContext.Provider value={setActions}>
      <PageHeaderActionsContext.Provider value={actions}>
        {children}
      </PageHeaderActionsContext.Provider>
    </PageHeaderActionsSetterContext.Provider>
  );
}

export function usePageHeaderActions(
  actions: ReactNode,
  dependencies: DependencyList = [],
) {
  const setActions = useContext(PageHeaderActionsSetterContext);

  if (!setActions) {
    throw new Error(
      "usePageHeaderActions must be used within a PageHeaderActionsProvider.",
    );
  }

  useEffect(() => {
    setActions(actions);

    return () => {
      setActions(null);
    };
  }, [setActions, ...dependencies]);
}

export function usePageHeaderActionsContext() {
  const actions = useContext(PageHeaderActionsContext);

  if (actions === undefined) {
    throw new Error(
      "usePageHeaderActionsContext must be used within a PageHeaderActionsProvider.",
    );
  }

  return { actions };
}
